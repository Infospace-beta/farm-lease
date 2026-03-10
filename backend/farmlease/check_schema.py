"""Check database schema."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.db import connection

# Check the schema
with connection.cursor() as cursor:
    cursor.execute("PRAGMA table_info(landmanagement_landlisting)")
    columns = cursor.fetchall()
    print("Columns in landmanagement_landlisting:")
    for col in columns:
        print(f"  {col}")
