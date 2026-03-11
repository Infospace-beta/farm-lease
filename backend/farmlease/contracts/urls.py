"""URL configuration for the contracts app."""
from django.urls import path
from . import views

urlpatterns = [
    # Owner endpoints
    path(
        'owner/lease-requests/',
        views.OwnerLeaseRequestListView.as_view(),
        name='owner-lease-requests'
    ),
    path(
        'owner/lease-requests/<int:pk>/',
        views.OwnerLeaseRequestDetailView.as_view(),
        name='owner-lease-request-detail'
    ),
    path(
        'owner/lease-requests/<int:pk>/approve/',
        views.approve_lease_request,
        name='approve-lease-request'
    ),
    path(
        'owner/lease-requests/<int:pk>/reject/',
        views.reject_lease_request,
        name='reject-lease-request'
    ),
    path(
        'owner/agreements/',
        views.OwnerAgreementListView.as_view(),
        name='owner-agreements'
    ),
    path(
        'owner/agreements/<int:pk>/',
        views.OwnerAgreementDetailView.as_view(),
        name='owner-agreement-detail'
    ),
    path(
        'owner/agreements/<int:pk>/sign/',
        views.sign_agreement_owner,
        name='sign-agreement-owner'
    ),

    # Lessee lease-request endpoints
    path(
        'lease-requests/',
        views.LesseeLeaseRequestListCreateView.as_view(),
        name='lessee-lease-requests'
    ),
    path(
        'lease-requests/<int:pk>/',
        views.LesseeLeaseRequestDetailView.as_view(),
        name='lessee-lease-request-detail'
    ),
    path(
        'lease-requests/<int:pk>/cancel/',
        views.cancel_lease_request,
        name='cancel-lease-request'
    ),

    # Lessee agreement endpoints
    path(
        'agreements/',
        views.LesseeAgreementListView.as_view(),
        name='lessee-agreements'
    ),
    path(
        'agreements/<int:pk>/',
        views.LesseeAgreementDetailView.as_view(),
        name='lessee-agreement-detail'
    ),
    path(
        'agreements/<int:pk>/submit/',
        views.submit_agreement_lessee,
        name='submit-agreement-lessee'
    ),
    path(
        'agreements/<int:pk>/witness-sign/',
        views.sign_agreement_witness,
        name='sign-agreement-witness'
    ),
]
