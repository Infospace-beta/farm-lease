from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsSystemAdmin
from .serializers import (
    ChangePasswordSerializer,
    MyTokenObtainPairSerializer,
    SignupSerializer,
    UserSerializer,
)

User = get_user_model()


# ─── Lessee Dashboard View ────────────────────────────────────────────────────
class LesseeDashboardView(APIView):
    """Return aggregated stats for the authenticated lessee's dashboard."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from contracts.models import LeaseRequest
        from payments.models import Transaction

        user = request.user
        lease_requests = LeaseRequest.objects.filter(lessee=user)
        active_leases = lease_requests.filter(status='accepted')
        pending_leases = lease_requests.filter(status='pending')

        monthly_expenditure = 0
        try:
            from django.utils import timezone
            now = timezone.now()
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_payments = Transaction.objects.filter(
                user=user,
                created_at__gte=start_of_month,
                status='completed',
            )
            monthly_expenditure = float(
                sum(float(p.amount) for p in month_payments)
            )
        except Exception:
            pass

        total_leased_acres = 0
        try:
            for lr in active_leases:
                if hasattr(lr, 'land') and lr.land and hasattr(lr.land, 'total_area'):
                    total_leased_acres += float(lr.land.total_area or 0)
        except Exception:
            pass

        return Response({
            'active_leases': active_leases.count(),
            'pending_leases': pending_leases.count(),
            'total_leased_acres': round(total_leased_acres, 2),
            'monthly_expenditure': monthly_expenditure,
            'avg_soil_health': 0,
        })


# ─── Notification Views ────────────────────────────────────────────────────────
class MyNotificationListView(APIView):
    """Return all DB-persisted notifications for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import Notification
        notifs = Notification.objects.filter(user=request.user)[:50]
        results = [
            {
                'id': n.id,
                'title': n.title,
                'body': n.body,
                'notif_type': n.notif_type,
                'icon': n.icon,
                'related_id': n.related_id,
                'is_read': n.is_read,
                'read': n.is_read,
                'created_at': n.created_at.isoformat(),
            }
            for n in notifs
        ]
        unread = sum(1 for r in results if not r['is_read'])
        return Response({'results': results, 'count': len(results), 'unread': unread})


class LesseeNotificationListView(MyNotificationListView):
    """Alias: lessee uses the same endpoint."""
    pass


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_unread_count(request):
    from .models import Notification
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    from .models import Notification
    notif = Notification.objects.filter(pk=pk, user=request.user).first()
    if notif:
        notif.is_read = True
        notif.save(update_fields=['is_read'])
    return Response({'detail': 'Marked as read.'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    from .models import Notification
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'detail': 'All notifications marked as read.'})


class SignupView(generics.CreateAPIView):
    """API endpoint for user signup"""

    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """Override to add better error logging and handling"""
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            # Log the error for debugging
            import traceback
            print(f"==== Signup Error ====")
            print(f"Request data: {request.data}")
            print(f"Error: {str(e)}")
            if hasattr(e, 'detail'):
                print(f"Error detail: {e.detail}")
            print(f"Traceback: {traceback.format_exc()}")
            print(f"=====================")
            raise


class MyTokenObtainPairView(TokenObtainPairView):
    """Login view returning JWT tokens with custom claims."""

    serializer_class = MyTokenObtainPairSerializer


class LogoutView(APIView):
    """Logout user and blacklist refresh token."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's profile."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change the current user's password."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Wrong password'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {'message': 'Password changed successfully'},
            status=status.HTTP_200_OK,
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """Lightweight profile endpoint for token validation on refresh."""

    return Response(UserSerializer(request.user).data)


class AdminDashboardStatsView(APIView):
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        stats = {
            "total_farmers": User.objects.filter(role="farmer").count(),
            "total_landowners": User.objects.filter(role="landowner").count(),
            "system_revenue_estimate": 0.00,
        }
        return Response(stats)
