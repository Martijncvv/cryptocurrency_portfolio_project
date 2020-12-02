from django.db import IntegrityError

from django.shortcuts import render
from django.http import HttpResponse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django import forms

from .models import User, Portfolio, Coinholding, Settings

def index(request):
    if request.method == "POST":
        # REGISTER 
        username = request.POST.get("username", False)
        if (username != False):
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
            except IntegrityError:
                return render(request, "cryptofolio/index.html", {
                    "message_register": "Username already taken."
                })
            login(request, user)
            return render(request, "cryptofolio/index.html")
    
       
        #LOGIN
        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return render(request, "cryptofolio/index.html")
        else:
            return render(request, "cryptofolio/index.html", {
                "message_login": "Invalid email and/or password."
            })
    
    return render(request, "cryptofolio/index.html")