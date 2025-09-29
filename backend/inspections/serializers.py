"""Serializers for inspection API."""
from __future__ import annotations

from typing import Any

from rest_framework import serializers

from . import models


class TankSerializer(serializers.ModelSerializer):
    def validate_construction_annotations(self, value: Any):
        if value in (None, ''):
            return {'standard': {}, 'additional': []}
        if not isinstance(value, dict):
            raise serializers.ValidationError('Construction annotations must be an object.')
        standard = value.get('standard') or {}
        additional = value.get('additional') or []
        if not isinstance(standard, dict):
            raise serializers.ValidationError({'standard': 'Must be an object keyed by field id.'})
        normalised_standard: dict[str, dict[str, Any]] = {}
        for key, entry in standard.items():
            if not isinstance(entry, dict):
                raise serializers.ValidationError({key: 'Annotation must be an object.'})
            normalised_standard[key] = {
                'color': entry.get('color'),
                've': bool(entry.get('ve', False)),
                'ut': bool(entry.get('ut', False)),
                'comment': entry.get('comment', '') or '',
            }
            if normalised_standard[key]['color'] not in {None, 'red', 'blue', 'yellow', 'green'}:
                raise serializers.ValidationError({key: 'Color must be red, blue, yellow, green, or null.'})
        if not isinstance(additional, list):
            raise serializers.ValidationError({'additional': 'Must be a list of custom entries.'})
        normalised_additional: list[dict[str, Any]] = []
        for idx, entry in enumerate(additional):
            if not isinstance(entry, dict):
                raise serializers.ValidationError({idx: 'Each additional item must be an object.'})
            colour = entry.get('color')
            if colour not in {None, 'red', 'blue', 'yellow', 'green'}:
                raise serializers.ValidationError({idx: 'Color must be red, blue, yellow, green, or null.'})
            normalised_additional.append({
                'label': entry.get('label', '') or '',
                'value': entry.get('value', '') or '',
                'color': colour,
                've': bool(entry.get('ve', False)),
                'ut': bool(entry.get('ut', False)),
                'comment': entry.get('comment', '') or '',
            })
        return {'standard': normalised_standard, 'additional': normalised_additional}

    class Meta:
        model = models.Tank
        fields = '__all__'
        read_only_fields = ('tank_unique_id', 'created_at', 'updated_at')


class ShellSettlementSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ShellSettlementSurvey
        fields = '__all__'

    def validate_readings(self, value: Any):
        if not isinstance(value, list):
            raise serializers.ValidationError('Readings must be a list of station measurements.')
        for item in value:
            if not isinstance(item, dict):
                raise serializers.ValidationError('Each reading must be an object.')
            if 'station_label' not in item or 'measurement_in' not in item:
                raise serializers.ValidationError('Each reading must include station_label and measurement_in.')
        return value


class UTResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UTResult
        fields = '__all__'

    def validate(self, attrs: dict[str, Any]):
        category = attrs.get('category')
        course = attrs.get('course')
        if category == models.UTResult.CATEGORY_CHOICES[3][0] and course is None:
            raise serializers.ValidationError({'course': 'Shell UT results must include a course number.'})
        return super().validate(attrs)


class EdgeSettlementCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EdgeSettlementCheck
        fields = '__all__'


class ColumnPlumbnessCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ColumnPlumbnessCheck
        fields = '__all__'


class VisualFindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VisualFinding
        fields = '__all__'


class OtherNDESerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OtherNDE
        fields = '__all__'


class GoalQuestionTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GoalQuestionTemplate
        fields = '__all__'


class GoalResultSerializer(serializers.ModelSerializer):
    tank = serializers.PrimaryKeyRelatedField(queryset=models.Tank.objects.all())
    goal_key_display = serializers.CharField(source='get_goal_key_display', read_only=True)

    class Meta:
        model = models.GoalResult
        fields = [
            'id',
            'tank',
            'goal_key',
            'goal_key_display',
            'methods',
            'standard_responses',
            'custom_responses',
            'created_at',
            'updated_at',
        ]

    def validate_methods(self, value: Any):
        if not isinstance(value, list):
            raise serializers.ValidationError('Methods must be a list of strings.')
        return value

    def validate_standard_responses(self, value: Any):
        if not isinstance(value, dict):
            raise serializers.ValidationError('Standard responses must be an object.')
        return value

    def validate_custom_responses(self, value: Any):
        if not isinstance(value, list):
            raise serializers.ValidationError('Custom responses must be a list.')
        return value

    def create(self, validated_data: dict[str, Any]):
        instance: models.GoalResult = super().create(validated_data)
        instance.ensure_defaults()
        return instance

    def update(self, instance: models.GoalResult, validated_data: dict[str, Any]):
        instance = super().update(instance, validated_data)
        instance.ensure_defaults()
        return instance


class TankDetailSerializer(TankSerializer):
    shell_settlement_surveys = ShellSettlementSurveySerializer(many=True, read_only=True)
    ut_results = UTResultSerializer(many=True, read_only=True)
    edge_settlement_checks = EdgeSettlementCheckSerializer(many=True, read_only=True)
    column_plumbness_checks = ColumnPlumbnessCheckSerializer(many=True, read_only=True)
    visual_findings = VisualFindingSerializer(many=True, read_only=True)
    other_nde = OtherNDESerializer(many=True, read_only=True)
    goal_results = GoalResultSerializer(many=True, read_only=True)

    class Meta(TankSerializer.Meta):
        fields = '__all__'
