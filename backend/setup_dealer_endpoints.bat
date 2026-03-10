@echo off
cd farmlease
echo Creating database migrations...
python manage.py makemigrations productplace
echo.
echo Applying migrations...
python manage.py migrate
echo.
echo Starting development server...
python manage.py runserver
