from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django import forms

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
            coin = Portfolio.objects.get( user = user, coin_name = request.POST["delete_note_button"])
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
                    "message_register": "Passwords must match."
                })

            # Attempt to create new user
            try:
                user = User.objects.create_user(username, email, password)
                user.save()

            except ValueError:
                return render(request, "cryptofolio/index.html", {
                    "message_register": "Wrong input.",
                     "HELPMESSAGE": "REGISTER ValueError"
                })
            except IntegrityError:
                return render(request, "cryptofolio/index.html", {
                    "message_register": "Username already taken.",
                    "HELPMESSAGE": "REGISTER IntegrityError"
                })
            login(request, user)

        # LOGOUT
        if "logout" in request.POST:
            logout(request)
            return render(request, "cryptofolio/index.html")


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
                    "message_login": "User does not exist"
                })

            user = authenticate(request, username=username, password=password)

            # Check if authentication successful
            if user is not None:
                login(request, user)
            else:
                return render(request, "cryptofolio/index.html", {
                    "message_login": "Invalid email and/or password."})
    
    # current holdings of user
    trade_buy_history = Trade.objects.filter(user = user, tradetype = "BUY")
    # coin_buy_amount = 
    
    # coin_sell_amount =
    # coin_balance = coin_buy_amount - coin_sell_amount

    trade_history = Trade.objects.filter(user = user)
    user_portfolio = Portfolio.objects.filter(user = user)
    return render(request, "cryptofolio/index.html", {
        "trade_history": trade_history,
        "user_portfolio": user_portfolio,
        "coin_page_name": coin_page_name.strip(),
        "TEST": trade_buy_history
    })