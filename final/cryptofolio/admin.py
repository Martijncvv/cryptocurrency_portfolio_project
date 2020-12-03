from django.contrib import admin
from .models import User, Settings, Portfoliocoin, Trade
# Register your models here.
admin.site.register(User)
admin.site.register(Settings)
admin.site.register(Portfoliocoin)
admin.site.register(Trade)