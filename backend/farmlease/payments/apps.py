from django.apps import AppConfig

#name should match the name of the app folder.
class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payments'
