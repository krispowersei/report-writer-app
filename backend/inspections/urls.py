"""Inspection API URL routing."""
from __future__ import annotations

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('tanks', views.TankViewSet, basename='tanks')
router.register('shell-settlement-surveys', views.ShellSettlementSurveyViewSet, basename='shell-settlement-surveys')
router.register('ut-results', views.UTResultViewSet, basename='ut-results')
router.register('edge-settlement-checks', views.EdgeSettlementCheckViewSet, basename='edge-settlement-checks')
router.register('column-plumbness-checks', views.ColumnPlumbnessCheckViewSet, basename='column-plumbness-checks')
router.register('visual-findings', views.VisualFindingViewSet, basename='visual-findings')
router.register('other-nde', views.OtherNDEViewSet, basename='other-nde')
router.register('goal-results', views.GoalResultViewSet, basename='goal-results')
router.register('goal-question-templates', views.GoalQuestionTemplateViewSet, basename='goal-question-templates')
router.register('metadata', views.MetadataViewSet, basename='metadata')

urlpatterns = router.urls
