from rest_framework import permissions


class IsSystemAdmin(permissions.BasePermission):
    """
    Allow access only to users with role='admin' or is_staff=True.
    Checking role covers admin accounts whose is_staff flag was not
    yet synced (e.g. created before the auto-sync was added).
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(
            user.is_staff or
            getattr(user, 'role', None) == 'admin'
        )