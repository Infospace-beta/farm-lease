"""Check table data."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.db import connection

# Check the data
with connection.cursor() as cursor:
    # Get all data
    cursor.execute("SELECT * FROM landmanagement_landlisting")
    rows = cursor.fetchall()
    print(f"Found {len(rows)} rows")
    for row in rows:
        print(row)
        
    print("\n---")
    # Check applied migrations
    cursor.execute("SELECT * FROM django_migrations WHERE app = 'landmanagement'")
    migrations = cursor.fetchall()
    print("Applied migrations:")
    for m in migrations:
        print(f"  {m}") 