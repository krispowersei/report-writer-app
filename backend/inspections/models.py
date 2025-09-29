"""Data models for the tank inspection workflows."""
from __future__ import annotations

import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base with created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Tank(TimeStampedModel):
    """Master data record for a storage tank."""

    FACILITY_CHOICES = [
        ('terminal', 'Terminal'),
        ('refinery', 'Refinery'),
        ('production', 'Production'),
        ('other', 'Other'),
    ]

    FOUNDATION_CHOICES = [
        ('concrete', 'Concrete'),
        ('earthen', 'Earthen'),
        ('piles', 'Pile supported'),
        ('ringwall', 'Ringwall'),
        ('other', 'Other'),
    ]

    ACCESS_STRUCTURE_CHOICES = [
        ('stair', 'Stair'),
        ('ladder', 'Ladder'),
        ('catwalk', 'Catwalk'),
        ('other', 'Other'),
    ]

    tank_unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tank_name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    facility_type = models.CharField(max_length=64, choices=FACILITY_CHOICES)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=64)
    year_built = models.PositiveIntegerField(null=True, blank=True)
    design_standard = models.CharField(max_length=128)
    manufacturer = models.CharField(max_length=255, null=True, blank=True)
    product_stored = models.CharField(max_length=255)
    inspection_type = models.CharField(max_length=128, blank=True, default='')
    client_name = models.CharField(max_length=255, blank=True, default='')
    exact_address = models.CharField(max_length=255, blank=True, default='')
    po_number = models.CharField(max_length=128, blank=True, default='')
    inspection_date = models.DateField(null=True, blank=True)
    construction_date = models.DateField(null=True, blank=True)
    external_inspection_date = models.DateField(null=True, blank=True)
    internal_inspection_date = models.DateField(null=True, blank=True)
    ut_inspection_date = models.DateField(null=True, blank=True)
    next_inspection_due_date = models.DateField(null=True, blank=True)
    nameplate_present = models.BooleanField(default=False)
    diameter_ft = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    height_ft = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    capacity_bbl = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    operating_height_ft = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    foundation = models.CharField(max_length=64, choices=FOUNDATION_CHOICES)
    anchors = models.CharField(max_length=255)
    shell_weld_type = models.CharField(max_length=255)
    shell_number_of_courses = models.PositiveIntegerField(null=True, blank=True)
    insulation = models.CharField(max_length=255)
    shell_manway = models.CharField(max_length=255)
    drain = models.CharField(max_length=255, null=True, blank=True)
    level_gauge_type = models.CharField(max_length=255, null=True, blank=True)
    access_structure = models.CharField(max_length=64, choices=ACCESS_STRUCTURE_CHOICES)
    bottom_type = models.CharField(max_length=255)
    bottom_weld = models.CharField(max_length=255, null=True, blank=True)
    annular_plate = models.CharField(max_length=255, null=True, blank=True)
    fixed_roof_type = models.CharField(max_length=255, null=True, blank=True)
    floating_roof_type = models.CharField(max_length=255, null=True, blank=True)
    primary_seal = models.CharField(max_length=255, null=True, blank=True)
    secondary_seal = models.CharField(max_length=255, null=True, blank=True)
    anti_rotation_device = models.CharField(max_length=255, null=True, blank=True)
    vent_type_and_number = models.CharField(max_length=255, null=True, blank=True)
    emergency_venting_type = models.CharField(max_length=255, null=True, blank=True)
    roof_manway_or_hatch = models.CharField(max_length=255, null=True, blank=True)
    inlet_size_in = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    outlet_size_in = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    flow_rate_in_bph = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    flow_rate_out_bph = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pressure = models.CharField(max_length=255, null=True, blank=True)
    temperature = models.CharField(max_length=255, null=True, blank=True)
    secondary_containment_type = models.CharField(max_length=255)
    construction_annotations = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['tank_name']

    def __str__(self) -> str:
        return f"{self.tank_name} ({self.tank_unique_id})"


class ShellSettlementSurvey(TimeStampedModel):
    """Stores settlement survey readings per tank."""

    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='shell_settlement_surveys')
    station_count = models.PositiveIntegerField()
    readings = models.JSONField(help_text='List of {station_label, measurement_in}')

    class Meta:
        ordering = ['-created_at']


class UTResult(TimeStampedModel):
    """Ultrasonic thickness results grouped by category."""

    CATEGORY_CHOICES = [
        ('bottom', 'Bottom'),
        ('appurtenance', 'Appurtenance'),
        ('roof', 'Roof'),
        ('shell', 'Shell'),
    ]

    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='ut_results')
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=255)
    course = models.PositiveIntegerField(null=True, blank=True)
    thickness_in = models.DecimalField(max_digits=6, decimal_places=4)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['category', 'course', '-created_at']


class EdgeSettlementCheck(TimeStampedModel):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='edge_settlement_checks')
    present = models.BooleanField()
    result = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']


class ColumnPlumbnessCheck(TimeStampedModel):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='column_plumbness_checks')
    column_id = models.CharField(max_length=64)
    plumbness_in_per_ft = models.DecimalField(max_digits=6, decimal_places=4)
    direction = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['column_id', '-created_at']


class VisualFinding(TimeStampedModel):
    COMMENT_CHOICES = [
        ('perform', 'Perform'),
        ('consider', 'Consider'),
        ('monitor', 'Monitor'),
    ]

    AREA_CHOICES = [
        ('shell', 'Shell'),
        ('bottom_extension', 'Bottom extension'),
        ('roof', 'Roof'),
        ('nozzle', 'Nozzle'),
        ('access_structure', 'Access structure'),
        ('venting', 'Venting'),
        ('coating', 'Coating'),
        ('other', 'Other'),
    ]

    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='visual_findings')
    area = models.CharField(max_length=64, choices=AREA_CHOICES)
    finding = models.TextField()
    comment_type = models.CharField(max_length=32, choices=COMMENT_CHOICES)

    class Meta:
        ordering = ['-created_at']


class OtherNDE(TimeStampedModel):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='other_nde')
    nde_type = models.CharField(max_length=32)
    result = models.TextField()

    class Meta:
        ordering = ['-created_at']


class GoalKey(models.TextChoices):
    GOAL_1 = 'goal_1', 'Identify leak paths'
    GOAL_2 = 'goal_2', 'Identify future leak risks'
    GOAL_3 = 'goal_3', 'Foundation settlement'
    GOAL_4 = 'goal_4', 'Access structure'
    GOAL_5 = 'goal_5', 'Fixed roof'
    GOAL_6 = 'goal_6', 'Floating roof'
    GOAL_7 = 'goal_7', 'Venting'
    GOAL_8 = 'goal_8', 'Coating'


class GoalQuestionTemplate(TimeStampedModel):
    """Stores reusable questions for each inspection goal."""

    goal_key = models.CharField(max_length=16, choices=GoalKey.choices)
    prompt = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ('goal_key', 'prompt')
        ordering = ['goal_key', 'prompt']

    def __str__(self) -> str:
        return f"{self.goal_key}: {self.prompt}"


class GoalResult(TimeStampedModel):
    """Captures summary results per goal for a given tank."""

    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='goal_results')
    goal_key = models.CharField(max_length=16, choices=GoalKey.choices)
    methods = models.JSONField(default=list, blank=True)
    standard_responses = models.JSONField(default=dict, blank=True)
    custom_responses = models.JSONField(default=list, blank=True)

    class Meta:
        unique_together = ('tank', 'goal_key')
        ordering = ['goal_key']

    def ensure_defaults(self) -> None:
        """Populate missing standard response keys where needed."""
        defaults: dict[str, str | bool | None] = {}
        if self.goal_key == GoalKey.GOAL_1:
            defaults = {
                'mfl_performed': None,
                'mfl_summary': '',
                'external_interval_typical': True,
                'external_interval_notes': '',
                'internal_interval_typical': True,
                'internal_interval_notes': '',
                'ut_interval_typical': True,
                'ut_interval_notes': '',
            }
        else:
            defaults = {
                'shell_ut_nominal': True,
                'shell_ut_notes': '',
                'damaged_appurtenances': False,
                'appurtenance_notes': '',
            }
        combined = {**defaults, **self.standard_responses}
        self.standard_responses = combined

    def save(self, *args, **kwargs):  # type: ignore[override]
        self.ensure_defaults()
        return super().save(*args, **kwargs)
