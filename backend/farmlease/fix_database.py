#!/usr/bin/env python
"""Script to check and fix database issues."""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.core.management import call_command
from django.db import connection

def main():
    """Check database and apply migrations."""
    print("="*50)
    print("Database Diagnostics & Fix Script")
    print("="*50)
    
    # Check if database exists
    print("\n1. Checking database connection...")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("   ✓ Database connection successful")
    except Exception as e:
        print(f"   ✗ Database connection failed: {e}")
        return
    
    # Check for unapplied migrations
    print("\n2. Checking for unapplied migrations...")
    try:
        call_command('showmigrations', '--plan')
    except Exception as e:
        print(f"   ✗ Error checking migrations: {e}")
    
    # Apply migrations
    print("\n3. Applying all migrations...")
    try:
        call_command('migrate', '--noinput')
        print("   ✓ Migrations applied successfully")
    except Exception as e:
        print(f"   ✗ Migration failed: {e}")
        print("\n   Attempting to recreate database...")
        
        # If migrations fail, try to reset the database
        try:
            # Delete database file
            db_file = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
            if os.path.exists(db_file):
                os.remove(db_file)
                print(f"   ✓ Removed old database: {db_file}")
            
            # Apply migrations again
            call_command('migrate', '--noinput')
            print("   ✓ Database recreated and migrations applied")
            
            # Create superuser
            print("\n4. Creating default superuser...")
            from django.contrib.auth import get_user_model
            User = get_user_model()
            if not User.objects.filter(email='admin@farmlease.com').exists():
                User.objects.create_superuser(
                    email='admin@farmlease.com',
                    username='admin',
                    password='admin123',
                    role='admin'
                )
                print("   ✓ Superuser created: admin@farmlease.com / admin123")
            
        except Exception as e:
            print(f"   ✗ Database recreation failed: {e}")
            return
    
    # Verify tables exist
    print("\n5. Verifying database tables...")
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' 
                ORDER BY name
            """)
            tables = [row[0] for row in cursor.fetchall()]
            print(f"   ✓ Found {len(tables)} tables:")
            for table in tables:
                if not table.startswith('django_') and not table.startswith('sqlite_'):
                    print(f"      - {table}")
    except Exception as e:
        print(f"   ✗ Error verifying tables: {e}")
    
    print("\n" + "="*50)
    print("Database check complete!")
    print("="*50)
    print("\nNow restart your Django server with:")
    print("  python manage.py runserver")
    print("="*50)

if __name__ == '__main__':
    main()
