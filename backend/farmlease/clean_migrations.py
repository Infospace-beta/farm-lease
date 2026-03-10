"""Clean up migration state."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.db import connection

# Remove conflicting migration records
with connection.cursor() as cursor:
    # Delete the old migration records that no longer have files
    cursor.execute("""
        DELETE FROM django_migrations 
        WHERE app = 'landmanagement' 
        AND name IN ('0002_landlisting_title_deed_number', '0003_landlisting_verification_pending_and_more', '0004_remove_landlisting_verification_pending_and_more')
    """)
    print(f"Removed {cursor.rowcount} old migration records")
    
    # Show remaining migrations
    cursor.execute("SELECT * FROM django_migrations WHERE app = 'landmanagement'")
    migrations = cursor.fetchall()
    print("\nRemaining migrations:")
    for m in migrations:
        print(f"  {m}")
