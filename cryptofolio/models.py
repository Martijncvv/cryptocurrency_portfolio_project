from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass
    portfolioID = models.ForeignKey("Portfolio", models.SET_NULL, blank=True, null=True)
    settingsID = models.ForeignKey("Settings", models.SET_NULL, blank=True, null=True)


class Portfolio(models.Model):
    """
    Portfolio data of a user
    """
    userID = models.ForeignKey("User", on_delete=models.CASCADE)
    coinID = models.ForeignKey("Coinholding", on_delete=models.CASCADE)


class Coinholding(models.Model):
    """
    Information about coin 
    """
    coinTicker = models.CharField(max_length=6)
    coinName = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=10000000000, decimal_places=50)
    amount = models.DecimalField(max_digits=1000000000000, decimal_places=50)
    time = models.DateTimeField(auto_now=True)
    comment = models.CharField(max_length=350)

class Settings(models.Model):
    """
    User settings data
    """
    Language = models.CharField(max_length=6)
    Currency = models.CharField(max_length=10)

