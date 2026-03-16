"""
Repair migration: adds soil_type, latitude, longitude to
landmanagement_soilclimatedata — columns declared in 0001_initial but absent
from the database. Uses IF NOT EXISTS so it is safe to run on any DB.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('landmanagement', '0006_add_missing_is_flagged_flag_reason'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            ALTER TABLE landmanagement_soilclimatedata
                ADD COLUMN IF NOT EXISTS soil_type varchar(50) NULL;
            ALTER TABLE landmanagement_soilclimatedata
                ADD COLUMN IF NOT EXISTS latitude numeric(9, 6) NULL;
            ALTER TABLE landmanagement_soilclimatedata
                ADD COLUMN IF NOT EXISTS longitude numeric(9, 6) NULL;
            """,
            reverse_sql="""
            ALTER TABLE landmanagement_soilclimatedata DROP COLUMN IF EXISTS soil_type;
            ALTER TABLE landmanagement_soilclimatedata DROP COLUMN IF EXISTS latitude;
            ALTER TABLE landmanagement_soilclimatedata DROP COLUMN IF EXISTS longitude;
            """,
        ),
    ]
