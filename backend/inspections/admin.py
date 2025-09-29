"""Admin registrations for inspection models."""
from __future__ import annotations

from django.contrib import admin

from . import models


@admin.register(models.Tank)
class TankAdmin(admin.ModelAdmin):
    list_display = ('tank_name', 'tank_unique_id', 'owner', 'facility_type', 'city', 'state')
    search_fields = ('tank_name', 'tank_unique_id', 'owner', 'city', 'state')
    list_filter = ('facility_type', 'state', 'design_standard')


@admin.register(models.ShellSettlementSurvey)
class ShellSettlementSurveyAdmin(admin.ModelAdmin):
    list_display = ('tank', 'station_count', 'created_at')
    list_filter = ('tank',)


@admin.register(models.UTResult)
class UTResultAdmin(admin.ModelAdmin):
    list_display = ('tank', 'category', 'location', 'course', 'thickness_in', 'created_at')
    list_filter = ('category', 'tank')
    search_fields = ('location',)


@admin.register(models.EdgeSettlementCheck)
class EdgeSettlementCheckAdmin(admin.ModelAdmin):
    list_display = ('tank', 'present', 'created_at')
    list_filter = ('present', 'tank')


@admin.register(models.ColumnPlumbnessCheck)
class ColumnPlumbnessCheckAdmin(admin.ModelAdmin):
    list_display = ('tank', 'column_id', 'plumbness_in_per_ft', 'created_at')
    list_filter = ('tank',)


@admin.register(models.VisualFinding)
class VisualFindingAdmin(admin.ModelAdmin):
    list_display = ('tank', 'area', 'comment_type', 'created_at')
    list_filter = ('area', 'comment_type', 'tank')


@admin.register(models.OtherNDE)
class OtherNDEAdmin(admin.ModelAdmin):
    list_display = ('tank', 'nde_type', 'created_at')
    list_filter = ('nde_type', 'tank')


@admin.register(models.GoalQuestionTemplate)
class GoalQuestionTemplateAdmin(admin.ModelAdmin):
    list_display = ('goal_key', 'prompt', 'is_default', 'created_at')
    list_filter = ('goal_key', 'is_default')


@admin.register(models.GoalResult)
class GoalResultAdmin(admin.ModelAdmin):
    list_display = ('tank', 'goal_key', 'created_at')
    list_filter = ('goal_key', 'tank')
