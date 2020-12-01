from django.shortcuts import render
from django.http import HttpResponse

# login 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import User, Portfolio, Coinholding, Settings

def index(request):
    return render(request, "cryptofolio/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "cryptofolio/index.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "cryptofolio/index.html")
