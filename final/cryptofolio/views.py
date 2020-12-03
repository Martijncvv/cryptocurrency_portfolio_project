from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django import forms

from .models import User, Settings, Portfoliocoin, Trade

def index(request):
    if request.method == "POST":
        # get user data
        if request.user.is_authenticated:
            user = User.objects.get(username = request.user)
        else:
            user = None

        # ADD TRADE FORM
        if "add_trade" in request.POST:
            coin_ticker = request.POST["coin_ticker"]
            coin_price = request.POST["coin_price"]
            coin_amount = request.POST["coin_amount"]
            trade_type = "SELL"
            if "trade_type" in request.POST:
                trade_type = "BUY"
            
            
            # if coin not in user's portfolio, add coin to portfolio
            if not (Portfoliocoin.objects.filter(user = user, coinTicker = coin_ticker).exists()):
                coin = Portfoliocoin(user = user,
                                    coinTicker = coin_ticker)
                coin.save()

            #add trade to DB
            trade = Trade(user = user,
                        coinTicker = coin_ticker,
                        price = coin_price,
                        amount = coin_amount,
                        tradetype = trade_type)
            trade.save()
            
            return render(request, "cryptofolio/index.html", {
                    "HELPMESSAGE": "TRADE ADDED"
                })

        


        # ADD PORTFOLIO
        if "addportfolio" in request.POST:
            
            return render(request, "cryptofolio/index.html", {
                "HELPMESSAGE": "ADDED TO PORTFOLIO"
            })



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
            return render(request, "cryptofolio/index.html",
            {
            "HELPMESSAGE": "REGISTER user added"
            })

        # LOGOUT
        if "logout" in request.POST:
            logout(request)
            return render(request, "cryptofolio/index.html")


        #LOGIN
        # Attempt to sign user in
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
            return render(request, "cryptofolio/index.html", {
            "HELPMESSAGE": "LOGIN user is not none"
            })
        else:
            return render(request, "cryptofolio/index.html", {
                "message_login": "Invalid email and/or password.",
                "HELPMESSAGE": username
                
            })
    
    return render(request, "cryptofolio/index.html")