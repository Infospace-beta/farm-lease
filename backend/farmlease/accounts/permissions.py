from rest_framework import permissions

class IsSystemAdmin(permissions.BasePermission):
    """
    Custom permission to only allow users with is_staff=True.
    """
    def has_permission(self, request, view):
        # Check if the user is logged in AND is a staff member
        return bool(request.user and request.user.is_staff)