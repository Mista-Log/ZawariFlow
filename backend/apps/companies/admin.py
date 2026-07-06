from django.contrib import admin
from .models import Company, Supplier, PurchaseOrder, PurchaseOrderItem


admin.site.register(Supplier)
admin.site.register(Company)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)