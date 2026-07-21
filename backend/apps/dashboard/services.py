from collections import defaultdict
from datetime import timedelta
from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from apps.companies.models import (
    PurchaseOrder,
    PurchaseOrderStatus,
    Supplier,
    SupplierStatus,
)

from apps.payments.models import (
    Settlement,
    SettlementStatus,
    VirtualAccount,
)


def get_dashboard_stats(company):

    settled = Settlement.objects.filter(
        purchase_order__company=company,
        status=SettlementStatus.SUCCESS,
    ).aggregate(
        total=Sum("amount")
    )["total"] or Decimal("0.00")

    pending = Settlement.objects.filter(
        purchase_order__company=company,
        status__in=[
            SettlementStatus.PENDING,
            SettlementStatus.PROCESSING,
        ],
    ).aggregate(
        total=Sum("amount")
    )["total"] or Decimal("0.00")

    purchase_orders = PurchaseOrder.objects.filter(
        company=company,
    ).exclude(
        status=PurchaseOrderStatus.SETTLED
    ).count()

    suppliers = Supplier.objects.filter(
        company=company,
        status=SupplierStatus.VERIFIED,
    ).count()

    return {
        "settled_volume": float(settled),
        "open_purchase_orders": purchase_orders,
        "pending_settlements": float(pending),
        "active_suppliers": suppliers,
    }



def get_settlement_chart(company):

    today = timezone.now()

    start = today - timedelta(days=6)

    settlements = Settlement.objects.filter(
        purchase_order__company=company,
        status=SettlementStatus.SUCCESS,
        settled_at__date__gte=start.date(),
    )

    values = defaultdict(Decimal)

    for settlement in settlements:

        key = settlement.settled_at.strftime("%a")

        values[key] += settlement.amount

    result = []

    for i in range(7):

        day = start + timedelta(days=i)

        label = day.strftime("%a")

        result.append({
            "day": label,
            "volume": float(values.get(label, Decimal("0"))),
        })

    return result


from collections import defaultdict

def get_split_breakdown(company):

    suppliers = Supplier.objects.filter(
        company=company
    )

    totals = defaultdict(Decimal)

    grand_total = Decimal("0")

    for supplier in suppliers:
        totals[supplier.category] += supplier.transaction_volume
        grand_total += supplier.transaction_volume

    if grand_total == 0:
        return []

    return [
        {
            "label": category.title(),
            "pct": round(float(amount / grand_total * 100), 1)
        }
        for category, amount in totals.items()
    ]


from django.utils.timesince import timesince


def get_recent_activity(company):

    activity = []

    settlements = Settlement.objects.filter(
        purchase_order__company=company
    ).select_related(
        "supplier",
        "purchase_order"
    )

    for settlement in settlements:

        activity.append({
            "id": settlement.purchase_order.po_number,
            "desc": f"Settlement to {settlement.supplier.name}",
            "amt": float(settlement.amount),
            "status": settlement.status.title(),
            "time": timesince(settlement.created_at) + " ago",
            "created_at": settlement.created_at,
        })

    purchase_orders = PurchaseOrder.objects.filter(
        company=company
    )

    for po in purchase_orders:

        activity.append({
            "id": po.po_number,
            "desc": "Purchase order created",
            "amt": float(po.amount),
            "status": po.status.title(),
            "time": timesince(po.created_at) + " ago",
            "created_at": po.created_at,
        })

    accounts = VirtualAccount.objects.filter(
        company=company
    ).select_related("supplier")

    for account in accounts:

        activity.append({
            "id": account.account_number[-6:],
            "desc": f"Virtual account created · {account.supplier.name}",
            "amt": None,
            "status": account.status.title(),
            "time": timesince(account.created_at) + " ago",
            "created_at": account.created_at,
        })

    activity.sort(
        key=lambda x: x["created_at"],
        reverse=True,
    )

    return activity[:10]


def get_dashboard_overview(company):

    return {
        "stats": get_dashboard_stats(company),
        "chart": get_settlement_chart(company),
        "split_breakdown": get_split_breakdown(company),
        "recent_activity": get_recent_activity(company),
    }