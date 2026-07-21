from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    settled_volume = serializers.FloatField()
    open_purchase_orders = serializers.IntegerField()
    pending_settlements = serializers.FloatField()
    active_suppliers = serializers.IntegerField()


class DashboardChartSerializer(serializers.Serializer):
    day = serializers.CharField()
    volume = serializers.FloatField()


class DashboardSplitSerializer(serializers.Serializer):
    label = serializers.CharField()
    pct = serializers.FloatField()


class DashboardActivitySerializer(serializers.Serializer):
    id = serializers.CharField()
    desc = serializers.CharField()
    amt = serializers.FloatField(allow_null=True)
    status = serializers.CharField()
    time = serializers.CharField()


class DashboardOverviewSerializer(serializers.Serializer):
    stats = DashboardStatsSerializer()
    chart = DashboardChartSerializer(many=True)
    split_breakdown = DashboardSplitSerializer(many=True)
    recent_activity = DashboardActivitySerializer(many=True)