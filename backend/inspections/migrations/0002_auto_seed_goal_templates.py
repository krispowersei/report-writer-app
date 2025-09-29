from __future__ import annotations

from django.db import migrations


def seed_goal_templates(apps, schema_editor):
    GoalQuestionTemplate = apps.get_model('inspections', 'GoalQuestionTemplate')

    templates = [
        ('goal_1', 'Was MFL performed?'),
        ('goal_1', 'External inspection interval typical?'),
        ('goal_1', 'Internal inspection interval typical?'),
        ('goal_1', 'UT inspection interval typical?'),
        ('goal_1', 'Additional Goal 1 questions'),
        ('goal_2', 'Is shell UT nominal?'),
        ('goal_2', 'Any corroded or damaged appurtenances?'),
        ('goal_3', 'Is shell UT nominal?'),
        ('goal_3', 'Any corroded or damaged appurtenances?'),
        ('goal_4', 'Is shell UT nominal?'),
        ('goal_4', 'Any corroded or damaged appurtenances?'),
        ('goal_5', 'Is shell UT nominal?'),
        ('goal_5', 'Any corroded or damaged appurtenances?'),
        ('goal_6', 'Is shell UT nominal?'),
        ('goal_6', 'Any corroded or damaged appurtenances?'),
        ('goal_7', 'Is shell UT nominal?'),
        ('goal_7', 'Any corroded or damaged appurtenances?'),
        ('goal_8', 'Is shell UT nominal?'),
        ('goal_8', 'Any corroded or damaged appurtenances?'),
    ]

    for goal_key, prompt in templates:
        GoalQuestionTemplate.objects.update_or_create(
            goal_key=goal_key,
            prompt=prompt,
            defaults={'is_default': True},
        )


def unseed_goal_templates(apps, schema_editor):
    GoalQuestionTemplate = apps.get_model('inspections', 'GoalQuestionTemplate')
    prompts = [
        'Was MFL performed?',
        'External inspection interval typical?',
        'Internal inspection interval typical?',
        'UT inspection interval typical?',
        'Additional Goal 1 questions',
        'Is shell UT nominal?',
        'Any corroded or damaged appurtenances?',
    ]
    GoalQuestionTemplate.objects.filter(prompt__in=prompts, is_default=True).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('inspections', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_goal_templates, unseed_goal_templates),
    ]
