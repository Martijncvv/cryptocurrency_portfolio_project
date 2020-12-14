from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render
from django.urls import reverse

from django.db.models import Sum
from django import forms
from json import dumps
import datetime

from .models import User, Settings, Portfolio, Trade

def index(request):
     # get user data
    if request.user.is_authenticated:
        user = User.objects.get(username = request.user)
    else:
         user = None

    # set default page to display
    coin_name = "bitcoin"

    if request.method == "POST":
        # add note
        if "add_note_button" in request.POST:
            coin_name = request.POST["add_note_button"]
            coin_note = request.POST["coin_note"]
            # add new portfolio coin if coin doesn't exist, else update existing database.
            if Portfolio.objects.filter(user = user, coin_name = coin_name).exists():
                coin = Portfolio.objects.get(user = user, coin_name = coin_name)
                coin.note = coin_note
            else:
                # store note
                coin = Portfolio(user = user, 
                                coin_name = coin_name,
                                note = coin_note)
            coin.save()

        # delete note
        if "delete_note_button" in request.POST:
            coin_name = request.POST["delete_note_button"]
            coin = Portfolio.objects.get(user = user, coin_name = coin_name)
            coin.note = None
            coin.save()

        # add trade
        if "add_trade" in request.POST:
            coin_name = request.POST["coin_name"]
            coin_price = request.POST["coin_price"]
            coin_amount = request.POST["coin_amount"]
            trade_type = "SELL"
            if "trade_type" in request.POST:
                trade_type = "BUY"
            
            # if coin not in user's portfolio, add coin to portfolio
            if not (Portfolio.objects.filter(user = user, coin_name = coin_name).exists()):
                coin = Portfolio(user = user,
                                    coin_name = coin_name)
                coin.save()
            #add trade to database
            trade = Trade(user = user,
                        coin_name = coin_name,
                        price = coin_price,
                        amount = coin_amount,
                        tradetype = trade_type)
            trade.save()

        # delete trade
        if "delete_trade_id" in request.POST:
            trade_id = request.POST["delete_trade_id"]
            Trade.objects.filter(user = user, id = trade_id).delete()

        # add portfolio
        if "addportfolio" in request.POST:
            coin_name = request.POST["addportfolio"]
            # add new portfolio coin if coin doesn't exist, else remove coin from portfolio
            if not (Portfolio.objects.filter(user = user, coin_name = coin_name).exists()):
                coin = Portfolio( user = user,
                                    coin_name = request.POST["addportfolio"])
                coin.save()              
            else: 
                Portfolio.objects.filter(user = user, coin_name = coin_name).delete()

        # change user language preference
        if "language_settings" in request.POST:
            language_preference = request.POST["selected_language"]
            # add language preference if preferene doesn't exist, else update preference
            if not (Settings.objects.filter(user = user).exists()):
                setting = Settings( user = user,
                                language = request.POST["selected_language"])
                setting.save()              
            else: 
                Settings.objects.filter(user = user).update(language = request.POST["selected_language"])
            
        # register user
        if "username" in request.POST:
            username = request.POST["username"]
            email = request.POST["email"]

            # ensure password matches confirmation
            password = request.POST["password"]
            confirmation = request.POST["confirmation"]
            if password != confirmation:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_register": "Passwords must match."
                })

            # attempt to create new user
            try:
                user = User.objects.create_user(username, email, password)
                user.save()
            # if not possible to create user, return feedback
            except ValueError:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_register": "Wrong input."
                })
            except IntegrityError:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_register": "Username already taken."
                })
            login(request, user)

        # logout
        if "logout" in request.POST:
            logout(request)

        # login
        # attempt to sign user in
        if "email" in request.POST:
            email = request.POST["email"]
            password = request.POST["password"]
            # check if user exists, if not return feedback
            try:
                username = User.objects.get(email = email).username
            except:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_login": "User does not exist."
                })

            user = authenticate(request, username = username, password = password)

            # check if authentication successful, if not return feedback
            if user is not None:
                login(request, user)
            else:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_login": "Invalid email and/or password."})

    # set new coin page to currently viewing page
    coin_page_name = coin_name
    
    # get user's trade history and portfolio coins
    trade_history = Trade.objects.filter(user = user)
    user_portfolio = Portfolio.objects.filter(user = user)

    # get user's prefered language if available, else set english
    if (Settings.objects.filter(user = user).exists()):
        prefered_language = Settings.objects.get(user = user).language
    else:
        prefered_language = "en"

    # calculates current holdings of user
    user_holdings = []
    # iterate over every coin in portfolio, calculate current balance and add to list
    for coin in user_portfolio:
        current_coin_holding = 0
        # get total amount bought of coin
        trade_buy_history = Trade.objects.filter(user = user, coin_name = coin.coin_name, tradetype = "BUY").aggregate(Sum('amount'))
        if trade_buy_history["amount__sum"] != None:
            current_coin_holding = current_coin_holding + trade_buy_history["amount__sum"]
        # get total amount sold of coin
        trade_sell_history = Trade.objects.filter(user = user, coin_name = coin.coin_name, tradetype = "SELL").aggregate(Sum('amount'))
        if trade_sell_history["amount__sum"] != None:
        # calculate current holding of coin
            current_coin_holding = current_coin_holding - trade_sell_history["amount__sum"]
        # remove trailing zeroes and add coin holding to list
        user_holdings.append(float(current_coin_holding))

    # converts trade history data to JSON to send to Javascript
    trade_history_list = []
    for trade in trade_history:
        # convert values to the right type
        unixtime = trade.time.timestamp() * 1000
        amount_float = float(trade.amount)
        # put values in dictionary
        trade_dict = {
            "id": trade.id,
            "time": unixtime,
            "price": float(trade.price),
            "coin_name": trade.coin_name,
            "amount": amount_float,
            "tradetype": trade.tradetype
        }
        trade_history_list.append(trade_dict)
    # create JSON variable 
    trade_data_JSON = dumps(trade_history_list) 

    # converts notes data to JSON to send to Javascript
    note_dict = {}
    for coin in user_portfolio:
        note_dict[coin.coin_name] = coin.note
    # create JSON variable
    notes_data_JSON = dumps(note_dict) 

    # converts user portfolio data to JSON to send to Javascript
    user_portfolio_coin_holding_list = []
    for coin in user_portfolio:
        user_portfolio_coin_holding_list.append(coin.coin_name)
   # create JSON variable
    portfolio_coin_name_data_JSON = dumps(user_portfolio_coin_holding_list)

    # create JSON variable to send user holdings to Javascript
    portfolio_coin_amount_data_JSON = dumps(user_holdings)

    return render(request, "cryptofolio/index.html", {
        "trade_history": trade_history,
        "coin_page_name": coin_page_name.strip(),
        "portfolio_coin_name_data_JSON": portfolio_coin_name_data_JSON,
        "portfolio_coin_amount_data_JSON": portfolio_coin_amount_data_JSON,
        "trade_data_JSON": trade_data_JSON,
        "notes_data_JSON": notes_data_JSON,
        "language_preference_JSON": dumps(prefered_language)
    })
