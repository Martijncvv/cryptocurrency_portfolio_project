from django.contrib import admin
from .models import User, Settings, Portfolio, Trade
# Register your models here.
admin.site.register(User)
admin.site.register(Settings)
admin.site.register(Portfolio)
admin.site.register(Trade)