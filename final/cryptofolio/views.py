from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
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


    # set default page
    coin_page_name = "bitcoin"

    if request.method == "POST":
        # ADD note 
        if "add_note_button" in request.POST:
            coin_name = request.POST["add_note_button"]
            coin_note = request.POST["coin_note"]
            # Add new portfolio coin if coin didn't exist, else existing update DB.
            if Portfolio.objects.filter(user = user, coin_name = coin_name).exists():
                coin = Portfolio.objects.get(user = user, coin_name = coin_name)
                coin.note = coin_note
            else:
                coin = Portfolio(user = user, 
                                coin_name = coin_name,
                                note = coin_note)
            coin.save()
            coin_page_name = coin_name
        # DELETE note
        if "delete_note_button" in request.POST:
            coin = Portfolio.objects.get(user = user, coin_name = request.POST["delete_note_button"])
            coin.note = "None"
            coin.save()

        # ADD TRADE 
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

            #add trade to DB
            trade = Trade(user = user,
                        coin_name = coin_name,
                        price = coin_price,
                        amount = coin_amount,
                        tradetype = trade_type)
            trade.save()
            coin_page_name = coin_name

        # ADD PORTFOLIO
        if "addportfolio" in request.POST:
            coin_name = request.POST["addportfolio"]
            if not (Portfolio.objects.filter(user = user, coin_name = coin_name).exists()):
                coin = Portfolio( user = user,
                                    coin_name = request.POST["addportfolio"])
                coin.save()              
            else: 
                Portfolio.objects.filter(user = user, coin_name = coin_name).delete()
            coin_page_name = coin_name


        # REGISTER 
        # username = request.POST.get("username", False)
        if "username" in request.POST:
            username = request.POST["username"]
            email = request.POST["email"]

            # Ensure password matches confirmation
            password = request.POST["password"]
            confirmation = request.POST["confirmation"]
            if password != confirmation:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_register": "Passwords must match."
                })

            # Attempt to create new user
            try:
                user = User.objects.create_user(username, email, password)
                user.save()

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

        # LOGOUT
        if "logout" in request.POST:
            logout(request)
            return render(request, "cryptofolio/index.html", {
                "coin_page_name": coin_page_name.strip(),
            })


        #LOGIN
        # Attempt to sign user in
        if "email" in request.POST:
            email = request.POST["email"]
            password = request.POST["password"]
            # check if user exists
            try:
                username = User.objects.get(email = email).username
            except:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_login": "User does not exist."
                })

            user = authenticate(request, username = username, password = password)

            # Check if authentication successful
            if user is not None:
                login(request, user)
            else:
                return render(request, "cryptofolio/index.html", {
                    "coin_page_name": coin_page_name.strip(),
                    "message_login": "Invalid email and/or password."})
    
    # gets user's trade history, portfolio coins
    trade_history = Trade.objects.filter(user = user)
    user_portfolio = Portfolio.objects.filter(user = user)

    # calculates current holdings of user
    # iterate over every coin in portfolio, calculate current balance and add to list
    user_holdings = []
    for coin in user_portfolio:
        current_coin_holding = 0
        # get total amount bought
        trade_buy_history = Trade.objects.filter(user = user, coin_name = coin.coin_name, tradetype = "BUY").aggregate(Sum('amount'))
        if trade_buy_history["amount__sum"] != None:
            current_coin_holding = current_coin_holding + trade_buy_history["amount__sum"]
        # get total amount sold
        trade_sell_history = Trade.objects.filter(user = user, coin_name = coin.coin_name, tradetype = "SELL").aggregate(Sum('amount'))
        if trade_sell_history["amount__sum"] != None:
            current_coin_holding = current_coin_holding - trade_sell_history["amount__sum"]
        # removing trailing zeroes and add to list
        user_holdings.append(float(current_coin_holding))

    # converts trade history data to JSON to send to Javascript
    trade_history_list = []
    for trade in trade_history:

        # convert values to the right type
        unixtime = trade.time.timestamp() * 1000
        amount_float = float(trade.amount)

        trade_dict = {
            "time": unixtime,
            "price": float(trade.price),
            "coin_name": trade.coin_name,
            "amount": amount_float,
            "tradetype": trade.tradetype
        }
        trade_history_list.append(trade_dict)
    # create JSON variable to send trade data to Javascript
    trade_data_JSON = dumps(trade_history_list) 

    # converts notes data to JSON to send to Javascript
    note_dict = {}
    for coin in user_portfolio:
        note_dict[coin.coin_name] = coin.note
    # create JSON variable to send note data to Javascript
    notes_data_JSON = dumps(note_dict) 

    return render(request, "cryptofolio/index.html", {
        "trade_history": trade_history,
        "user_portfolio": user_portfolio,
        "coin_page_name": coin_page_name.strip(),
        "user_holdings_amount": user_holdings,
        "trade_data_JSON": trade_data_JSON,
        "notes_data_JSON": notes_data_JSON,
    })
