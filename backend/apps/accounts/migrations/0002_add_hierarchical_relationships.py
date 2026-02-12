# Generated manually
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        # Add hierarchical relationship fields
        migrations.AddField(
            model_name='user',
            name='assigned_counsellor',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='assigned_students',
                to=settings.AUTH_USER_MODEL,
                help_text='Counsellor assigned to this student/alumni'
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='reports_to_hod',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='counsellors_under_hod',
                to=settings.AUTH_USER_MODEL,
                help_text='HOD that this counsellor reports to'
            ),
        ),
        # Fix groups and user_permissions to avoid clashes
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(
                blank=True,
                help_text='The groups this user belongs to.',
                related_name='custom_user_set',
                related_query_name='custom_user',
                to='auth.group',
                verbose_name='groups'
            ),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(
                blank=True,
                help_text='Specific permissions for this user.',
                related_name='custom_user_set',
                related_query_name='custom_user',
                to='auth.permission',
                verbose_name='user permissions'
            ),
        ),
        # Add new fields to StudentProfile
        migrations.AddField(
            model_name='studentprofile',
            name='current_year',
            field=models.IntegerField(default=1),
        ),
        migrations.RenameField(
            model_name='studentprofile',
            old_name='semester',
            new_name='current_semester',
        ),
        # Add missing fields to StudentProfile
        migrations.AddField(
            model_name='studentprofile',
            name='location',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='profile_picture',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='resume',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='social_profiles',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='certifications',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='internships',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='placements',
            field=models.JSONField(blank=True, default=list),
        ),
        # Add missing fields to AlumniProfile  
        migrations.AddField(
            model_name='alumniprofile',
            name='location',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='alumniprofile',
            name='profile_picture',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='alumniprofile',
            name='social_profiles',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='alumniprofile',
            name='work_experience',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='alumniprofile',
            name='achievements',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
