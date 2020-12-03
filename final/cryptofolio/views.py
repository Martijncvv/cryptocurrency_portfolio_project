from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django import forms

from .models import User, Settings, Portfoliocoin, Trades

def index(request):
    if request.method == "POST":
        # ADD TRADE
        if "coin_amount" in request.POST:
            coin_ticker = request.POST["coin_ticker"]
            coin_amount = request.POST["coin_amount"]
            coin_price = request.POST["coin_price"]

        # ADD PORTFOLIO
          # LOGOUT
        if "addportfolio" in request.POST:
            
            return render(request, "cryptofolio/index.html")



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