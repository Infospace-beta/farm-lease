"""
Repair migration: adds is_flagged and flag_reason columns that were present in
0001_initial but missing from the actual database (schema was created before
those fields were introduced). Uses IF NOT EXISTS so this is idempotent and
safe to run on any database.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('landmanagement', '0005_landlisting_leased_area'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            ALTER TABLE landmanagement_landlisting
                ADD COLUMN IF NOT EXISTS is_flagged boolean NOT NULL DEFAULT false;
            ALTER TABLE landmanagement_landlisting
                ADD COLUMN IF NOT EXISTS flag_reason text NULL;
            """,
            reverse_sql="""
            ALTER TABLE landmanagement_landlisting DROP COLUMN IF EXISTS is_flagged;
            ALTER TABLE landmanagement_landlisting DROP COLUMN IF EXISTS flag_reason;
            """,
        ),
    ]
