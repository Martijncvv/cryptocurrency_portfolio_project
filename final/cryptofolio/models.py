from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Settings(models.Model):
    """
    User settings data
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    Language = models.CharField(max_length=6)
    Currency = models.CharField(max_length=10)


class Portfolio(models.Model):
    """
    Information about coin 
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    coin_name = models.CharField(max_length=30)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"User:{self.user} | Coin name:{self.coin_name}  | Note:{self.note}"

class Trade(models.Model):
    """
    Information about coin 
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    coin_name = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=10000000000, decimal_places=20)
    amount = models.DecimalField(max_digits=1000000000000, decimal_places=20)
    tradetype = models.CharField(max_length=4)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"OBJECT: User:{self.user} | Coin name:{self.coin_name}  | Trade type:{self.tradetype}"


    # @property boven function; geen () nodig

    # class meta; extra data/limits voor de database

