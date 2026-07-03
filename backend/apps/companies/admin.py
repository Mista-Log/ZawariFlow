from django.contrib import admin
from .models import Company, Supplier
# Register your models here.


admin.site.register(Supplier)
admin.site.register(Company)