from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Settings(models.Model):
    """
    User settings data
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    language = models.CharField(max_length=6)
    currency = models.CharField(max_length=10)

    def __str__(self):
        return f"User:{self.user} | Language:{self.language}  | Currency:{self.currency}"


class Portfolio(models.Model):
    """
    User portfolio data
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    coin_name = models.CharField(max_length=30)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"User:{self.user} | Coin name:{self.coin_name}  | Note:{self.note}"

class Trade(models.Model):
    """
    User trade data
    """
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    coin_name = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=10000000000, decimal_places=20)
    amount = models.DecimalField(max_digits=1000000000000, decimal_places=20)
    tradetype = models.CharField(max_length=4)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User:{self.user} | Coin name:{self.coin_name}  | Trade type:{self.tradetype} | Amount:{self.amount}"


