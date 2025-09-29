"""REST API views for inspection workflows."""
from __future__ import annotations

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, serializers


class TankViewSet(viewsets.ModelViewSet):
    queryset = models.Tank.objects.all().order_by('tank_name')
    serializer_class = serializers.TankSerializer

    def get_serializer_class(self):
        if self.action in {'retrieve', 'summary'}:
            return serializers.TankDetailSerializer
        return super().get_serializer_class()

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):  # type: ignore[override]
        tank = self.get_object()
        serializer = self.get_serializer(tank)
        return Response(serializer.data)


class ShellSettlementSurveyViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ShellSettlementSurveySerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.ShellSettlementSurvey.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class UTResultViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UTResultSerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.UTResult.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        category = self.request.query_params.get('category')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class EdgeSettlementCheckViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EdgeSettlementCheckSerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.EdgeSettlementCheck.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class ColumnPlumbnessCheckViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ColumnPlumbnessCheckSerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.ColumnPlumbnessCheck.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class VisualFindingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.VisualFindingSerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.VisualFinding.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class OtherNDEViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OtherNDESerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.OtherNDE.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class GoalResultViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GoalResultSerializer

    def get_queryset(self):  # type: ignore[override]
        queryset = models.GoalResult.objects.all()
        tank_id = self.request.query_params.get('tank_id')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset


class GoalQuestionTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GoalQuestionTemplateSerializer
    queryset = models.GoalQuestionTemplate.objects.all()

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        goal_key = self.request.query_params.get('goal_key')
        if goal_key:
            queryset = queryset.filter(goal_key=goal_key)
        return queryset


class MetadataViewSet(viewsets.ViewSet):
    """Provides static metadata like choice lists to power the UI."""

    def list(self, request):  # type: ignore[override]
        methods = [
            '100% Visual Examination (VE) of bottom plates, corner weld, and bottom welds',
            '100% VE of base of tank, bottom extension, and shell',
            'Document with digital camera',
            'Ultrasonic Thickness Testing (UT)',
            'Note brittle-fracture concerns if applicable',
            'Document findings affecting structural or hydraulic integrity',
            'Survey of the shell for settlement',
            'Survey of fixed-roof supports for plumbness',
            'VE of shell for bulges or distortion',
            'Document potential findings affecting foundation or bottom integrity',
            'Thorough VE of access structure and appurtenances',
            'Thorough VE of roof and appurtenances',
            'UT readings of accessible roof plates',
            'VE of floating roof and appurtenances (if present)',
            'VE of existing venting system',
            'VE of coatings',
        ]

        goals = [
            {'key': choice.value, 'label': choice.label}
            for choice in models.GoalKey
        ]

        return Response(
            {
                'methods': methods,
                'goals': goals,
                'tank_choices': {
                    'facility_type': models.Tank.FACILITY_CHOICES,
                    'foundation': models.Tank.FOUNDATION_CHOICES,
                    'access_structure': models.Tank.ACCESS_STRUCTURE_CHOICES,
                    'comment_types': models.VisualFinding.COMMENT_CHOICES,
                    'visual_areas': models.VisualFinding.AREA_CHOICES,
                    'ut_categories': models.UTResult.CATEGORY_CHOICES,
                },
            }
        )
