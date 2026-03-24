"""URL configuration for the payments app."""
from django.urls import path
from .views import (
    AdminEscrowListView,
    AdminReleaseWithdrawalView,
    AdminWithdrawalRequestsView,
    LesseeEscrowBalanceView,
    MpesaCallbackView,
    MpesaInitiateView,
    MyPaymentsView,
    OwnerTransactionDetailView,
    OwnerTransactionListView,
    OwnerEscrowDetailView,
    OwnerEscrowListView,
    owner_revenue_chart,
    owner_revenue_summary,
    owner_download_statement,
    PaymentStatusView,
    ReleaseEscrowView,
    request_withdrawal,
)

urlpatterns = [
    path('my-payments/', MyPaymentsView.as_view(), name='my-payments'),
    path('mpesa/initiate/', MpesaInitiateView.as_view(), name='mpesa-initiate'),
    path('mpesa/callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('status/<str:transaction_id>/', PaymentStatusView.as_view(), name='payment-status'),
    path('escrow/balance/', LesseeEscrowBalanceView.as_view(), name='lessee-escrow-balance'),
    path('escrow/<int:payment_id>/release/', ReleaseEscrowView.as_view(), name='release-escrow'),

    # Owner financials
    path('owner/transactions/', OwnerTransactionListView.as_view(), name='owner-transactions'),
    path('owner/transactions/<str:id>/', OwnerTransactionDetailView.as_view(), name='owner-transaction-detail'),
    path('owner/revenue/', owner_revenue_summary, name='owner-revenue-summary'),
    path('owner/revenue/chart/', owner_revenue_chart, name='owner-revenue-chart'),
    path('owner/statement/', owner_download_statement, name='owner-download-statement'),
    path('owner/withdraw/', request_withdrawal, name='owner-withdraw'),

    # Owner escrow
    path('owner/escrow/', OwnerEscrowListView.as_view(), name='owner-escrow-list'),
    path('owner/escrow/<int:pk>/', OwnerEscrowDetailView.as_view(), name='owner-escrow-detail'),

    # Admin escrow / withdrawals
    path('admin/escrow/', AdminEscrowListView.as_view(), name='admin-escrow-list'),
    path('admin/withdrawals/', AdminWithdrawalRequestsView.as_view(), name='admin-withdrawals'),
    path('admin/withdrawals/<str:transaction_id>/release/', AdminReleaseWithdrawalView.as_view(), name='admin-release-withdrawal'),
]
