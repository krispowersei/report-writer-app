from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspections', '0002_auto_seed_goal_templates'),
    ]

    operations = [
        migrations.AddField(
            model_name='tank',
            name='client_name',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='tank',
            name='construction_annotations',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='tank',
            name='construction_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tank',
            name='exact_address',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='tank',
            name='external_inspection_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tank',
            name='inspection_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tank',
            name='inspection_type',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
        migrations.AddField(
            model_name='tank',
            name='internal_inspection_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tank',
            name='next_inspection_due_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tank',
            name='po_number',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
        migrations.AddField(
            model_name='tank',
            name='ut_inspection_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
