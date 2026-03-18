#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path


def main():
    """Run administrative tasks."""
    # This repository keeps the Django project under backend/farmlease/.
    # Add that directory to PYTHONPATH so `python backend/manage.py ...` works.
    base_dir = Path(__file__).resolve().parent
    project_dir = base_dir / 'farmlease'
    sys.path.insert(0, str(project_dir))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
