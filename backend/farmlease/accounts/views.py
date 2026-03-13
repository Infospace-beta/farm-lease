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
        from django.db.models import Sum
        from landmanagement.models import LandListing
        from contracts.models import LeaseRequest, LeaseAgreement
        from payments.models import Transaction, EscrowAccount
        from productplace.models import Product

        # ── User stats ──────────────────────────────────────────────────────
        total_users = User.objects.count()
        total_farmers = User.objects.filter(role="farmer").count()
        total_landowners = User.objects.filter(role="landowner").count()
        total_dealers = User.objects.filter(role="dealer").count()

        # ── Land / verification stats ────────────────────────────────────────
        all_lands = LandListing.objects.all()
        pending_land_docs = all_lands.filter(is_verified=False, is_flagged=False).count()
        verified_lands = all_lands.filter(is_verified=True).count()
        flagged_lands = all_lands.filter(is_flagged=True).count()

        # ── Escrow total ─────────────────────────────────────────────────────
        escrow_total = float(
            EscrowAccount.objects.filter(status='active').aggregate(
                t=Sum('amount')
            )['t'] or 0
        )

        # ── Revenue = all completed transactions ─────────────────────────────
        platform_revenue = float(
            Transaction.objects.filter(status='completed').aggregate(
                t=Sum('amount')
            )['t'] or 0
        )

        # ── Active disputes (lease requests flagged as rejected with reason,
        #    or agreements in "terminated" status) — proxy for disputes ────────
        active_disputes = LeaseAgreement.objects.filter(
            status='terminated'
        ).count()

        # ── Active leases ────────────────────────────────────────────────────
        active_leases = LeaseAgreement.objects.filter(status='active').count()

        # ── Verification queue (pending lands, snippet for dashboard) ─────────
        pending_lands_qs = all_lands.filter(
            is_verified=False, is_flagged=False
        ).select_related('owner').order_by('-created_at')[:5]

        from django.utils import timezone
        now = timezone.now()

        def time_ago(dt):
            if not dt:
                return "Unknown"
            diff = now - dt
            seconds = int(diff.total_seconds())
            if seconds < 60:
                return "Just now"
            if seconds < 3600:
                mins = seconds // 60
                return f"{mins} min{'s' if mins > 1 else ''} ago"
            if seconds < 86400:
                hrs = seconds // 3600
                return f"{hrs} hr{'s' if hrs > 1 else ''} ago"
            days = seconds // 86400
            return f"{days} day{'s' if days > 1 else ''} ago"

        verification_queue = []
        for land in pending_lands_qs:
            owner = land.owner
            first = (owner.first_name or "")[:1].upper()
            last = (owner.last_name or "")[:1].upper()
            initials = (first + last) or owner.email[:2].upper()
            full_name = f"{owner.first_name} {owner.last_name}".strip() or owner.email
            verification_queue.append({
                "id": land.id,
                "name": full_name,
                "initials": initials,
                "plotId": land.title_deed_number or f"PLOT-{land.id}",
                "submitted": time_ago(land.created_at),
                "status": "Pending Check",
                "land_title": land.title,
            })

        # ── Dealer compliance snippet ─────────────────────────────────────────
        dealers_qs = User.objects.filter(role='dealer').order_by('-created_at')[:5]
        dealers_data = []
        for d in dealers_qs:
            product_count = Product.objects.filter(dealer=d).count()
            dealers_data.append({
                "id": d.id,
                "name": f"{d.first_name} {d.last_name}".strip() or d.username,
                "initials": (d.first_name[:1] + d.last_name[:1]).upper() if d.first_name else d.email[:1].upper(),
                "email": d.email,
                "product_count": product_count,
                "is_verified": d.is_verified,
                "flagged": 0,
            })

        # ── Recent activity from lease requests & transactions ────────────────
        activity = []

        # Latest user registrations
        recent_users = User.objects.order_by('-created_at')[:2]
        for u in recent_users:
            activity.append({
                "time": time_ago(u.created_at),
                "title": "New User Registration",
                "body": f"{u.first_name} {u.last_name}".strip() or u.email
                        + f" registered as a {u.get_role_display()}.",
                "type": "registration",
            })

        # Latest transactions
        recent_txns = Transaction.objects.filter(
            status='completed'
        ).select_related('user').order_by('-created_at')[:2]
        for txn in recent_txns:
            activity.append({
                "time": time_ago(txn.created_at),
                "title": "Payment Processed",
                "body": f"Ksh {float(txn.amount):,.0f} processed for {txn.description or txn.transaction_type}.",
                "type": "payment",
                "amount": float(txn.amount),
            })

        # Latest lease requests
        recent_leases = LeaseRequest.objects.select_related(
            'lessee', 'land'
        ).order_by('-created_at')[:2]
        for lr in recent_leases:
            activity.append({
                "time": time_ago(lr.created_at),
                "title": "Lease Request",
                "body": f"{lr.lessee.first_name or lr.lessee.email} submitted a lease request for {lr.land.title}.",
                "type": "lease",
            })

        # Sort activity by recency (already roughly ordered)
        activity = activity[:5]

        # ── Active disputes (terminated agreements) ──────────────────────────
        disputed_agreements = LeaseAgreement.objects.filter(
            status='terminated'
        ).select_related('lessee', 'owner', 'land').order_by('-created_at')[:3]

        disputes_data = []
        for ag in disputed_agreements:
            disputes_data.append({
                "id": ag.id,
                "label": f"Lease #{ag.id}",
                "note": f"{ag.land.title if ag.land else 'Land'} - Terminated",
                "priority": "High",
            })

        stats = {
            # Stat cards
            "total_users": total_users,
            "total_farmers": total_farmers,
            "total_landowners": total_landowners,
            "total_dealers": total_dealers,
            "pending_land_docs": pending_land_docs,
            "escrow_total": escrow_total,
            "platform_revenue": platform_revenue,
            "active_disputes": active_disputes,
            "active_leases": active_leases,
            "verified_lands": verified_lands,
            "flagged_lands": flagged_lands,
            # Sections
            "verification_queue": verification_queue,
            "dealers": dealers_data,
            "activity_pulse": activity,
            "disputes": disputes_data,
        }
        return Response(stats)


class AdminPaymentsView(APIView):
    """Admin view: payment stats + paginated transaction ledger."""
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        from django.db.models import Sum, Q
        from payments.models import Transaction, EscrowAccount

        # ── Summary stats ─────────────────────────────────────────────────────
        escrow_total = float(
            EscrowAccount.objects.filter(status='active').aggregate(
                t=Sum('amount')
            )['t'] or 0
        )
        released_funds = float(
            EscrowAccount.objects.filter(status='released').aggregate(
                t=Sum('released_amount')
            )['t'] or 0
        )
        platform_revenue = float(
            Transaction.objects.filter(status='completed').aggregate(
                t=Sum('amount')
            )['t'] or 0
        )
        total_transactions = Transaction.objects.count()

        # ── Transactions list (paginated, filtered) ───────────────────────────
        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except (ValueError, TypeError):
            page = 1
        try:
            page_size = min(100, max(1, int(request.query_params.get('page_size', 20))))
        except (ValueError, TypeError):
            page_size = 20

        search = request.query_params.get('search', '').strip()
        type_filter = request.query_params.get('type', '').strip()

        qs = Transaction.objects.select_related(
            'user',
            'agreement__land',
            'agreement__lessee',
            'agreement__owner',
        ).order_by('-created_at')

        if search:
            qs = qs.filter(
                Q(transaction_id__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(description__icontains=search) |
                Q(agreement__land__title__icontains=search)
            )
        if type_filter:
            qs = qs.filter(transaction_type=type_filter)

        total_count = qs.count()
        start = (page - 1) * page_size
        batch = qs[start: start + page_size]

        bg_colors = ['#0f392b', '#5D4037', '#0369a1', '#7c3aed', '#065f46', '#1e3a8a', '#6d28d9', '#b45309']

        status_map = {
            'pending':    {'label': 'Pending',         'bg': 'bg-yellow-100 text-yellow-700', 'pulse': True,  'note': 'Awaiting processing.'},
            'completed':  {'label': 'Funds Released',  'bg': 'bg-green-100 text-green-700',   'pulse': False, 'note': 'Transaction completed.'},
            'failed':     {'label': 'Failed',           'bg': 'bg-red-100 text-red-700',       'pulse': False, 'note': 'Transaction failed.'},
            'in_escrow':  {'label': 'Held in Escrow',  'bg': 'bg-orange-100 text-orange-700', 'pulse': True,  'note': 'Awaiting confirmation.'},
        }
        type_label_map = {
            'rent_payment':    'Lease Escrow',
            'escrow_release':  'Lease Escrow',
            'withdrawal':      'Withdrawal',
            'deposit':         'Deposit',
        }
        FEE_RATE = 0.10  # 10 %

        transactions_data = []
        for i, txn in enumerate(batch):
            user = txn.user
            first = (user.first_name or '')[:1].upper()
            last  = (user.last_name  or '')[:1].upper()
            initials  = (first + last) or user.email[:2].upper()
            full_name = f"{user.first_name} {user.last_name}".strip() or user.email

            beneficiary = full_name
            payer       = full_name
            land_detail = txn.description or ''

            if txn.agreement:
                ag = txn.agreement
                if ag.owner:
                    owner_name  = f"{ag.owner.first_name} {ag.owner.last_name}".strip() or ag.owner.email
                    beneficiary = f"{owner_name} (Lessor)"
                if ag.lessee:
                    lessee_name = f"{ag.lessee.first_name} {ag.lessee.last_name}".strip() or ag.lessee.email
                    payer       = f"{lessee_name} (Lessee)"
                if ag.land:
                    land_detail = f"Land Lease - {ag.land.title}"

            type_label = type_label_map.get(txn.transaction_type, 'Payment')
            s = status_map.get(txn.status, status_map['pending'])

            is_lease_type = txn.transaction_type in ('rent_payment', 'escrow_release')
            fee_amount    = float(txn.amount) * FEE_RATE if is_lease_type else None

            transactions_data.append({
                'id':           txn.transaction_id,
                'date':         txn.created_at.strftime('%b %d, %Y, %I:%M %p'),
                'partyInitials': initials,
                'partyBgHex':   bg_colors[i % len(bg_colors)],
                'beneficiary':  beneficiary,
                'from':         payer,
                'typeLabel':    type_label,
                'isLeaseType':  is_lease_type,
                'detail':       land_detail,
                'amount':       f"{float(txn.amount):,.2f}",
                'fee':          f"{fee_amount:,.2f}" if fee_amount is not None else 'Included',
                'feeRate':      '10%' if fee_amount is not None else '',
                'statusLabel':  s['label'],
                'statusBg':     s['bg'],
                'statusNote':   s['note'],
                'pulse':        s['pulse'],
            })

        total_pages = max(1, (total_count + page_size - 1) // page_size)

        return Response({
            'stats': {
                'escrow_total':       escrow_total,
                'released_funds':     released_funds,
                'platform_revenue':   platform_revenue,
                'total_transactions': total_transactions,
            },
            'transactions': transactions_data,
            'pagination': {
                'total':       total_count,
                'page':        page,
                'page_size':   page_size,
                'total_pages': total_pages,
            },
        })


class AdminUserListView(APIView):
    """List all non-admin users with pagination, search, and role/status filters."""
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        from django.core.paginator import Paginator
        from django.db.models import Q

        qs = User.objects.exclude(role='admin').order_by('-created_at')

        search = request.query_params.get('search', '').strip()
        role = request.query_params.get('role', '').strip()
        user_status = request.query_params.get('status', '').strip()
        page_num = max(1, int(request.query_params.get('page', 1)))
        page_size = min(100, max(1, int(request.query_params.get('page_size', 20))))

        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        if role:
            qs = qs.filter(role=role.lower())
        if user_status == 'active':
            qs = qs.filter(is_active=True)
        elif user_status == 'suspended':
            qs = qs.filter(is_active=False)

        # Stats (always across all non-admin users, not filtered)
        all_non_admin = User.objects.exclude(role='admin')
        stats = {
            'total_active': all_non_admin.filter(is_active=True).count(),
            'total_farmers': all_non_admin.filter(role='farmer').count(),
            'total_landowners': all_non_admin.filter(role='landowner').count(),
            'total_suspended': all_non_admin.filter(is_active=False).count(),
        }

        total = qs.count()
        paginator = Paginator(qs, page_size)
        page_obj = paginator.get_page(page_num)

        users_data = []
        for u in page_obj:
            full_name = f"{u.first_name} {u.last_name}".strip() or u.username or u.email
            first = (u.first_name or '')[:1].upper()
            last = (u.last_name or '')[:1].upper()
            initials = (first + last) if (first or last) else u.email[:2].upper()
            users_data.append({
                'id': u.id,
                'name': full_name,
                'email': u.email,
                'initials': initials,
                'role': u.role,
                'join_date': u.created_at.strftime('%b %d, %Y') if u.created_at else '',
                'is_active': u.is_active,
                'is_verified': u.is_verified,
            })

        return Response({
            'users': users_data,
            'total': total,
            'page': page_num,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'stats': stats,
        })


class AdminDealerOversightView(APIView):
    """Full dealer compliance oversight — stat cards + dealer list."""
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        from productplace.models import Product

        all_dealers = User.objects.filter(role='dealer')
        total_dealers = all_dealers.count()
        active_dealers = all_dealers.filter(is_active=True).count()
        compliant_dealers = all_dealers.filter(is_active=True, is_verified=True).count()
        suspended_dealers = all_dealers.filter(is_active=False).count()

        # Flagged listings = products that are hidden (is_visible=False)
        flagged_listings = Product.objects.filter(dealer__role='dealer', is_visible=False).count()

        # Avg compliance score: ratio of compliant (active + verified) to all active
        avg_score = round((compliant_dealers / active_dealers * 100) if active_dealers > 0 else 0)

        # Search / filter
        search = request.query_params.get('search', '').strip()
        status_filter = request.query_params.get('status', '').strip()

        qs = all_dealers.order_by('-created_at')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        if status_filter == 'active':
            qs = qs.filter(is_active=True)
        elif status_filter == 'suspended':
            qs = qs.filter(is_active=False)
        elif status_filter == 'unverified':
            qs = qs.filter(is_active=True, is_verified=False)

        dealers_data = []
        for d in qs:
            first = (d.first_name or '')[:1].upper()
            last = (d.last_name or '')[:1].upper()
            initials = (first + last) if (first or last) else d.email[:2].upper()
            full_name = f"{d.first_name} {d.last_name}".strip() or d.username

            d_products = Product.objects.filter(dealer=d)
            total_products = d_products.count()
            hidden_products = d_products.filter(is_visible=False).count()

            if not d.is_active:
                dealer_status = 'Suspended'
                violation = 'Account Suspended'
                flag_freq = 'Suspended'
            elif not d.is_verified:
                dealer_status = 'Unverified'
                violation = 'Unverified Account'
                flag_freq = 'Pending Review'
            else:
                dealer_status = 'Active'
                violation = 'None'
                flag_freq = 'None'

            dealers_data.append({
                'id': d.id,
                'name': full_name,
                'initials': initials,
                'email': d.email,
                'county': d.county or '',
                'is_active': d.is_active,
                'is_verified': d.is_verified,
                'total_products': total_products,
                'flagged_items': hidden_products,
                'status': dealer_status,
                'violation': violation,
                'flag_freq': flag_freq,
                'joined': d.created_at.strftime('%b %d, %Y') if d.created_at else '',
            })

        return Response({
            'stats': {
                'active_dealers': active_dealers,
                'compliant_dealers': compliant_dealers,
                'suspended_dealers': suspended_dealers,
                'flagged_listings': flagged_listings,
                'avg_compliance_score': avg_score,
                'total_dealers': total_dealers,
            },
            'dealers': dealers_data,
        })


class AdminUserSuspendView(APIView):
    """Toggle suspend/unsuspend for a single user."""
    permission_classes = [IsSystemAdmin]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.role == 'admin':
            return Response(
                {'detail': 'Cannot suspend admin users.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response({
            'id': user.id,
            'is_active': user.is_active,
            'detail': 'User unsuspended.' if user.is_active else 'User suspended.',
        })


class AdminAnalyticsView(APIView):
    """Platform-wide analytics: stat cards, revenue trends, land status, user growth, regions."""
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        from django.db.models import Sum, Count
        from django.db.models.functions import TruncMonth
        from django.utils import timezone
        from datetime import timedelta
        from landmanagement.models import LandListing
        from contracts.models import LeaseAgreement
        from payments.models import Transaction, EscrowAccount

        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Previous month start
        prev_month_end = month_start - timedelta(seconds=1)
        prev_month_start = prev_month_end.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )

        # ── Stat cards ──────────────────────────────────────────────────────
        total_revenue = float(
            Transaction.objects.filter(status='completed').aggregate(
                t=Sum('amount')
            )['t'] or 0
        )
        revenue_this_month = float(
            Transaction.objects.filter(
                status='completed', created_at__gte=month_start
            ).aggregate(t=Sum('amount'))['t'] or 0
        )
        revenue_last_month = float(
            Transaction.objects.filter(
                status='completed',
                created_at__gte=prev_month_start,
                created_at__lt=month_start,
            ).aggregate(t=Sum('amount'))['t'] or 0
        )

        new_users_this_month = User.objects.filter(created_at__gte=month_start).count()
        new_users_last_month = User.objects.filter(
            created_at__gte=prev_month_start, created_at__lt=month_start
        ).count()

        active_leases = LeaseAgreement.objects.filter(status='active').count()
        active_leases_last_month = LeaseAgreement.objects.filter(
            status='active', created_at__lt=month_start
        ).count()

        total_land_area = float(
            LandListing.objects.aggregate(t=Sum('total_area'))['t'] or 0
        )
        total_land_area_last_month = float(
            LandListing.objects.filter(created_at__lt=month_start).aggregate(
                t=Sum('total_area')
            )['t'] or 0
        )

        def pct_change(current, previous):
            if previous == 0:
                return '+0%' if current == 0 else '+100%'
            delta = ((current - previous) / previous) * 100
            sign = '+' if delta >= 0 else ''
            return f'{sign}{delta:.0f}%'

        # ── Monthly trends — last 7 months ──────────────────────────────────
        # Build ordered list of (label, year, month) for last 7 calendar months
        cal_months = []
        for i in range(6, -1, -1):
            year = now.year
            month = now.month - i
            while month <= 0:
                month += 12
                year -= 1
            cal_months.append((
                timezone.datetime(year, month, 1).strftime('%b'),
                year,
                month,
            ))

        seven_months_ago = timezone.datetime(
            cal_months[0][1], cal_months[0][2], 1, tzinfo=now.tzinfo
        )

        raw_fees = (
            Transaction.objects.filter(
                status='completed', created_at__gte=seven_months_ago
            )
            .annotate(mo=TruncMonth('created_at'))
            .values('mo')
            .annotate(total=Sum('amount'))
        )
        raw_escrow = (
            EscrowAccount.objects.filter(created_at__gte=seven_months_ago)
            .annotate(mo=TruncMonth('created_at'))
            .values('mo')
            .annotate(total=Sum('amount'))
        )

        def _key(dt):
            return (dt.year, dt.month)

        fees_map = {_key(r['mo']): float(r['total']) for r in raw_fees}
        escrow_map = {_key(r['mo']): float(r['total']) for r in raw_escrow}

        revenue_data = [
            {
                'month': label,
                'fees': fees_map.get((yr, mo), 0),
                'escrow': escrow_map.get((yr, mo), 0),
            }
            for label, yr, mo in cal_months
        ]

        # ── User growth — monthly ────────────────────────────────────────────
        raw_farmers = (
            User.objects.filter(role='farmer', created_at__gte=seven_months_ago)
            .annotate(mo=TruncMonth('created_at'))
            .values('mo')
            .annotate(cnt=Count('id'))
        )
        raw_owners = (
            User.objects.filter(role='landowner', created_at__gte=seven_months_ago)
            .annotate(mo=TruncMonth('created_at'))
            .values('mo')
            .annotate(cnt=Count('id'))
        )

        farmers_map = {_key(r['mo']): r['cnt'] for r in raw_farmers}
        owners_map = {_key(r['mo']): r['cnt'] for r in raw_owners}

        user_data = [
            {
                'month': label,
                'farmers': farmers_map.get((yr, mo), 0),
                'landowners': owners_map.get((yr, mo), 0),
            }
            for label, yr, mo in cal_months
        ]

        # ── Land status distribution (pie chart) ────────────────────────────
        PIE_COLORS = ['#13ec80', '#0f392b', '#5D4037', '#3b82f6']
        STATUS_LABELS = {
            'Vacant': 'Vacant',
            'Leased': 'Leased',
            'Pending_Payment': 'Pending Payment',
            'Under_Review': 'Under Review',
        }
        status_qs = (
            LandListing.objects.values('status').annotate(cnt=Count('id'))
        )
        status_map = {s['status']: s['cnt'] for s in status_qs}
        total_land_count = sum(status_map.values()) or 1
        land_status_data = []
        for i, (key, label) in enumerate(STATUS_LABELS.items()):
            cnt = status_map.get(key, 0)
            pct = round(cnt / total_land_count * 100)
            if pct > 0:
                land_status_data.append({
                    'name': label,
                    'value': pct,
                    'count': cnt,
                    'color': PIE_COLORS[i % len(PIE_COLORS)],
                })
        if not land_status_data:
            land_status_data = [{'name': 'No Data', 'value': 100, 'count': 0, 'color': '#e5e7eb'}]

        # ── Regional activity ────────────────────────────────────────────────
        REGION_COLORS = [
            'bg-[#0f392b]', 'bg-[#13ec80]', 'bg-[#5D4037]',
            'bg-blue-500', 'bg-purple-500', 'bg-gray-300',
        ]
        region_qs = (
            LandListing.objects.filter(agreements__isnull=False)
            .values('location_name')
            .annotate(lease_count=Count('agreements', distinct=True))
            .order_by('-lease_count')[:6]
        )
        if not region_qs:
            # Fall back to all lands grouped by location
            region_qs = (
                LandListing.objects.values('location_name')
                .annotate(lease_count=Count('id'))
                .order_by('-lease_count')[:6]
            )

        total_regional = sum(r['lease_count'] for r in region_qs) or 1
        regions = [
            {
                'name': r['location_name'] or 'Unknown',
                'share': round(r['lease_count'] / total_regional * 100),
                'leases': r['lease_count'],
                'color': REGION_COLORS[i % len(REGION_COLORS)],
            }
            for i, r in enumerate(region_qs)
        ]

        return Response({
            # Stat cards
            'total_revenue': total_revenue,
            'revenue_change': pct_change(revenue_this_month, revenue_last_month),
            'revenue_up': revenue_this_month >= revenue_last_month,
            'new_users_this_month': new_users_this_month,
            'user_change': pct_change(new_users_this_month, new_users_last_month),
            'user_up': new_users_this_month >= new_users_last_month,
            'active_leases': active_leases,
            'lease_change': pct_change(active_leases, active_leases_last_month),
            'lease_up': active_leases >= active_leases_last_month,
            'total_land_area': total_land_area,
            'land_area_change': pct_change(total_land_area, total_land_area_last_month),
            'land_area_up': total_land_area >= total_land_area_last_month,
            # Charts
            'revenue_data': revenue_data,
            'land_status_data': land_status_data,
            'user_data': user_data,
            'regions': regions,
        })
