"""Fix corrupted database data."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.db import connection

# Fix the corrupted data
with connection.cursor() as cursor:
    # Check what values exist
    cursor.execute("SELECT id, current_lessee_id FROM landmanagement_landlisting")
    rows = cursor.fetchall()
    print("Before fix:")
    for row in rows:
        print(f"  ID: {row[0]}, current_lessee_id: {row[1]}")
    
    # Fix any non-numeric current_lessee_id values
    cursor.execute("""
        UPDATE landmanagement_landlisting 
        SET current_lessee_id = NULL 
        WHERE current_lessee_id IS NOT NULL 
        AND typeof(current_lessee_id) = 'text'
    """)
    print(f"\nFixed {cursor.rowcount} corrupted rows")
    
    # Verify
    cursor.execute("SELECT id, current_lessee_id FROM landmanagement_landlisting")
    rows = cursor.fetchall()
    print("\nAfter fix:")
    for row in rows:
        print(f"  ID: {row[0]}, current_lessee_id: {row[1]}")
