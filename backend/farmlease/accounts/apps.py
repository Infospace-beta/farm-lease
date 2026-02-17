from django.apps import AppConfig

#name should match the name of the app folder.
class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
