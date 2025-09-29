# Generated manually to align with inspection app spec
from __future__ import annotations

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Tank',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'tank_unique_id',
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ('tank_name', models.CharField(max_length=255)),
                ('owner', models.CharField(max_length=255)),
                (
                    'facility_type',
                    models.CharField(
                        choices=[
                            ('terminal', 'Terminal'),
                            ('refinery', 'Refinery'),
                            ('production', 'Production'),
                            ('other', 'Other'),
                        ],
                        max_length=64,
                    ),
                ),
                ('city', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=64)),
                ('year_built', models.PositiveIntegerField(blank=True, null=True)),
                ('design_standard', models.CharField(max_length=128)),
                ('manufacturer', models.CharField(blank=True, max_length=255, null=True)),
                ('product_stored', models.CharField(max_length=255)),
                ('nameplate_present', models.BooleanField(default=False)),
                ('diameter_ft', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('height_ft', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('capacity_bbl', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                (
                    'operating_height_ft',
                    models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True),
                ),
                (
                    'foundation',
                    models.CharField(
                        choices=[
                            ('concrete', 'Concrete'),
                            ('earthen', 'Earthen'),
                            ('piles', 'Pile supported'),
                            ('ringwall', 'Ringwall'),
                            ('other', 'Other'),
                        ],
                        max_length=64,
                    ),
                ),
                ('anchors', models.CharField(max_length=255)),
                ('shell_weld_type', models.CharField(max_length=255)),
                ('shell_number_of_courses', models.PositiveIntegerField(blank=True, null=True)),
                ('insulation', models.CharField(blank=True, max_length=255, null=True)),
                ('shell_manway', models.CharField(max_length=255)),
                ('drain', models.CharField(blank=True, max_length=255, null=True)),
                ('level_gauge_type', models.CharField(blank=True, max_length=255, null=True)),
                (
                    'access_structure',
                    models.CharField(
                        choices=[
                            ('stair', 'Stair'),
                            ('ladder', 'Ladder'),
                            ('catwalk', 'Catwalk'),
                            ('other', 'Other'),
                        ],
                        max_length=64,
                    ),
                ),
                ('bottom_type', models.CharField(max_length=255)),
                ('bottom_weld', models.CharField(blank=True, max_length=255, null=True)),
                ('annular_plate', models.CharField(blank=True, max_length=255, null=True)),
                ('fixed_roof_type', models.CharField(blank=True, max_length=255, null=True)),
                ('floating_roof_type', models.CharField(blank=True, max_length=255, null=True)),
                ('primary_seal', models.CharField(blank=True, max_length=255, null=True)),
                ('secondary_seal', models.CharField(blank=True, max_length=255, null=True)),
                ('anti_rotation_device', models.CharField(blank=True, max_length=255, null=True)),
                ('vent_type_and_number', models.CharField(blank=True, max_length=255, null=True)),
                ('emergency_venting_type', models.CharField(blank=True, max_length=255, null=True)),
                ('roof_manway_or_hatch', models.CharField(blank=True, max_length=255, null=True)),
                ('inlet_size_in', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('outlet_size_in', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('flow_rate_in_bph', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('flow_rate_out_bph', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('pressure', models.CharField(blank=True, max_length=255, null=True)),
                ('temperature', models.CharField(blank=True, max_length=255, null=True)),
                ('secondary_containment_type', models.CharField(max_length=255)),
            ],
            options={'ordering': ['tank_name']},
        ),
        migrations.CreateModel(
            name='GoalQuestionTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'goal_key',
                    models.CharField(
                        choices=[
                            ('goal_1', 'Identify leak paths'),
                            ('goal_2', 'Identify future leak risks'),
                            ('goal_3', 'Foundation settlement'),
                            ('goal_4', 'Access structure'),
                            ('goal_5', 'Fixed roof'),
                            ('goal_6', 'Floating roof'),
                            ('goal_7', 'Venting'),
                            ('goal_8', 'Coating'),
                        ],
                        max_length=16,
                    ),
                ),
                ('prompt', models.CharField(max_length=255)),
                ('is_default', models.BooleanField(default=False)),
            ],
            options={'ordering': ['goal_key', 'prompt']},
        ),
        migrations.CreateModel(
            name='GoalResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'goal_key',
                    models.CharField(
                        choices=[
                            ('goal_1', 'Identify leak paths'),
                            ('goal_2', 'Identify future leak risks'),
                            ('goal_3', 'Foundation settlement'),
                            ('goal_4', 'Access structure'),
                            ('goal_5', 'Fixed roof'),
                            ('goal_6', 'Floating roof'),
                            ('goal_7', 'Venting'),
                            ('goal_8', 'Coating'),
                        ],
                        max_length=16,
                    ),
                ),
                ('methods', models.JSONField(blank=True, default=list)),
                ('standard_responses', models.JSONField(blank=True, default=dict)),
                ('custom_responses', models.JSONField(blank=True, default=list)),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='goal_results', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['goal_key'], 'unique_together': {('tank', 'goal_key')}},
        ),
        migrations.CreateModel(
            name='VisualFinding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'area',
                    models.CharField(
                        choices=[
                            ('shell', 'Shell'),
                            ('bottom_extension', 'Bottom extension'),
                            ('roof', 'Roof'),
                            ('nozzle', 'Nozzle'),
                            ('access_structure', 'Access structure'),
                            ('venting', 'Venting'),
                            ('coating', 'Coating'),
                            ('other', 'Other'),
                        ],
                        max_length=64,
                    ),
                ),
                (
                    'finding',
                    models.TextField(),
                ),
                (
                    'comment_type',
                    models.CharField(
                        choices=[('perform', 'Perform'), ('consider', 'Consider'), ('monitor', 'Monitor')],
                        max_length=32,
                    ),
                ),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='visual_findings', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='UTResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'category',
                    models.CharField(
                        choices=[('bottom', 'Bottom'), ('appurtenance', 'Appurtenance'), ('roof', 'Roof'), ('shell', 'Shell')],
                        max_length=32,
                    ),
                ),
                ('location', models.CharField(max_length=255)),
                ('course', models.PositiveIntegerField(blank=True, null=True)),
                ('thickness_in', models.DecimalField(decimal_places=4, max_digits=6)),
                ('notes', models.TextField(blank=True, null=True)),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='ut_results', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['category', 'course', '-created_at']},
        ),
        migrations.CreateModel(
            name='ShellSettlementSurvey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('station_count', models.PositiveIntegerField()),
                ('readings', models.JSONField(help_text='List of {station_label, measurement_in}')),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='shell_settlement_surveys', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='OtherNDE',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('nde_type', models.CharField(max_length=32)),
                ('result', models.TextField()),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='other_nde', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='EdgeSettlementCheck',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('present', models.BooleanField()),
                ('result', models.TextField(blank=True, null=True)),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='edge_settlement_checks', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='ColumnPlumbnessCheck',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('column_id', models.CharField(max_length=64)),
                ('plumbness_in_per_ft', models.DecimalField(decimal_places=4, max_digits=6)),
                ('direction', models.CharField(blank=True, max_length=255, null=True)),
                (
                    'tank',
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='column_plumbness_checks', to='inspections.tank'),
                ),
            ],
            options={'ordering': ['column_id', '-created_at']},
        ),
        migrations.AddConstraint(
            model_name='goalquestiontemplate',
            constraint=models.UniqueConstraint(fields=('goal_key', 'prompt'), name='unique_goal_prompt'),
        ),
    ]
