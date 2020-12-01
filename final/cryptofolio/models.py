from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

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
    comment = models.TextField()

class Settings(models.Model):
    """
    User settings data
    """
    userID = models.ForeignKey("User", on_delete=models.CASCADE)
    Language = models.CharField(max_length=6)
    Currency = models.CharField(max_length=10)


    # @property boven function; geen () nodig

    # class meta; extra data/limits voor de database