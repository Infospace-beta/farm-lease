"""URL configuration for the payments app."""
from django.urls import path
from . import views

urlpatterns = [
    # Owner transaction endpoints
    path(
        'owner/transactions/',
        views.OwnerTransactionListView.as_view(),
        name='owner-transactions'
    ),
    path(
        'owner/transactions/<int:pk>/',
        views.OwnerTransactionDetailView.as_view(),
        name='owner-transaction-detail'
    ),
    
    # Owner revenue endpoints
    path(
        'owner/revenue/',
        views.owner_revenue_summary,
        name='owner-revenue-summary'
    ),
    path(
        'owner/revenue/chart/',
        views.owner_revenue_chart,
        name='owner-revenue-chart'
    ),
    
    # Withdrawal
    path(
        'owner/withdraw/',
        views.request_withdrawal,
        name='request-withdrawal'
    ),
    
    # Escrow endpoints
    path(
        'owner/escrow/',
        views.OwnerEscrowListView.as_view(),
        name='owner-escrow-list'
    ),
    path(
        'owner/escrow/<int:pk>/',
        views.OwnerEscrowDetailView.as_view(),
        name='owner-escrow-detail'
    ),
]
