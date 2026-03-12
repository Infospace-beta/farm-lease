"""
Test script to demonstrate Admin-Owner Land Verification Integration
=====================================================================

This script tests the complete workflow:
1. Owner creates a land listing → Status: "Under_Review"
2. Admin fetches pending lands → Can see the new land
3. Admin verifies the land → Status changes to "Vacant"
4. Owner fetches their lands → Sees updated status

Run this after starting the Django server:
    cd backend/farmlease
    py manage.py runserver 8000
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000/api"

# ANSI color codes for terminal output
GREEN = '\033[92m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_step(step_num, description):
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}{BLUE}STEP {step_num}: {description}{RESET}")
    print(f"{BOLD}{BLUE}{'='*70}{RESET}\n")

def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")

def print_info(message):
    print(f"{YELLOW}ℹ {message}{RESET}")

def print_error(message):
    print(f"{RED}✗ {message}{RESET}")

def print_json(data, title="Response"):
    print(f"\n{BOLD}{title}:{RESET}")
    print(json.dumps(data, indent=2))

# ============================================================
# STEP 1: Login as Owner
# ============================================================
def login_as_owner():
    print_step(1, "LOGIN AS LAND OWNER")
    
    # First, try to create an owner account (if doesn't exist)
    owner_data = {
        "email": "test_owner@farmleasetest.com",
        "password": "TestPass123!",
        "password2": "TestPass123!",
        "role": "landowner",
        "first_name": "Test",
        "last_name": "Owner",
        "phone_number": "0712345678",
        "address": "123 Test Street",
        "county": "Nairobi",
        "id_number": "12345678"
    }
    
    # Try to register (will fail if already exists - that's ok)
    print_info("Attempting to register owner account...")
    register_response = requests.post(f"{BASE_URL}/auth/signup/", json=owner_data)
    
    if register_response.status_code == 201:
        print_success("Owner account created successfully")
    else:
        print_info("Owner account may already exist (attempting login)")
    
    # Login
    print_info("Logging in as owner...")
    login_data = {
        "email": owner_data["email"],
        "password": owner_data["password"]
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    
    if response.status_code == 200:
        tokens = response.json()
        print_success(f"Owner logged in successfully")
        print_json({"access_token": tokens["access"][:50] + "..."}, "Tokens")
        return tokens["access"]
    else:
        print_error(f"Login failed: {response.text}")
        return None

# ============================================================
# STEP 2: Create Land Listing
# ============================================================
def create_land_listing(owner_token):
    print_step(2, "OWNER CREATES LAND LISTING")
    
    land_data = {
        "title": f"Test Farm Plot - {datetime.now().strftime('%H:%M:%S')}",
        "description": "A test farm plot for verification workflow testing",
        "total_area": "5.50",
        "price_per_month": "10000.00",
        "preferred_duration": "6 months",
        "title_deed_number": "TD-TEST-12345",
        "has_irrigation": True,
        "has_electricity": False,
        "has_road_access": True,
        "has_fencing": False,
        "latitude": "-1.286389",
        "longitude": "36.817223"
    }
    
    headers = {"Authorization": f"Bearer {owner_token}"}
    
    print_info("Creating land listing...")
    response = requests.post(f"{BASE_URL}/lands/create-basic/", json=land_data, headers=headers)
    
    if response.status_code == 201:
        result = response.json()
        land_id = result["land_id"]
        print_success(f"Land listing created with ID: {land_id}")
        print_json(result, "Response")
        return land_id
    else:
        print_error(f"Failed to create land: {response.text}")
        return None

# ============================================================
# STEP 3: Check Land Status (Owner View)
# ============================================================
def check_owner_lands(owner_token, land_id):
    print_step(3, "CHECK LAND STATUS (OWNER VIEW)")
    
    headers = {"Authorization": f"Bearer {owner_token}"}
    
    print_info("Fetching owner's lands...")
    response = requests.get(f"{BASE_URL}/lands/my-lands/", headers=headers)
    
    if response.status_code == 200:
        lands = response.json()
        created_land = next((land for land in lands if land["id"] == land_id), None)
        
        if created_land:
            print_success(f"Found land: {created_land['title']}")
            print(f"\n{BOLD}Land Status:{RESET}")
            print(f"  • ID: {created_land['id']}")
            print(f"  • Title: {created_land['title']}")
            print(f"  • Status: {YELLOW}{created_land['status']}{RESET}")
            print(f"  • Is Verified: {created_land['is_verified']}")
            print(f"  • Is Flagged: {created_land['is_flagged']}")
            
            if created_land['status'] == 'Under_Review':
                print_success("✓ Correct! Status is 'Under_Review' (awaiting admin)")
            else:
                print_error(f"Unexpected status: {created_land['status']}")
        else:
            print_error(f"Could not find land with ID {land_id}")
    else:
        print_error(f"Failed to fetch lands: {response.text}")

# ============================================================
# STEP 4: Login as Admin
# ============================================================
def login_as_admin():
    print_step(4, "LOGIN AS ADMIN")
    
    # Create admin account
    admin_data = {
        "email": "test_admin@farmleasetest.com",
        "password": "AdminPass123!",
        "password2": "AdminPass123!",
        "role": "admin",
        "first_name": "Test",
        "last_name": "Admin",
        "phone_number": "0712345679",
        "address": "456 Admin Street",
        "county": "Nairobi",
        "id_number": "87654321"
    }
    
    print_info("Attempting to register admin account...")
    register_response = requests.post(f"{BASE_URL}/auth/signup/", json=admin_data)
    
    if register_response.status_code == 201:
        print_success("Admin account created")
        # Need to make this user staff via Django admin or database
        print_info("Note: You may need to set is_staff=True in Django admin")
    
    # Login
    print_info("Logging in as admin...")
    login_data = {
        "email": admin_data["email"],
        "password": admin_data["password"]
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    
    if response.status_code == 200:
        tokens = response.json()
        print_success("Admin logged in successfully")
        return tokens["access"]
    else:
        print_error(f"Login failed: {response.text}")
        return None

# ============================================================
# STEP 5: Admin Fetches Pending Lands
# ============================================================
def admin_fetch_pending(admin_token, land_id):
    print_step(5, "ADMIN FETCHES PENDING LANDS")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    print_info("Fetching all pending lands (filter=pending)...")
    response = requests.get(f"{BASE_URL}/lands/admin/all/?filter=pending", headers=headers)
    
    if response.status_code == 200:
        lands = response.json()
        print_success(f"Found {len(lands)} pending land(s)")
        
        # Find our test land
        test_land = next((land for land in lands if land["id"] == land_id), None)
        
        if test_land:
            print_success(f"✓ Test land found in pending queue!")
            print(f"\n{BOLD}Land Details:{RESET}")
            print(f"  • ID: {test_land['id']}")
            print(f"  • Title: {test_land['title']}")
            print(f"  • Owner: {test_land['owner_username']} ({test_land['owner_email']})")
            print(f"  • Title Deed: {test_land['title_deed_number']}")
            print(f"  • Status: {YELLOW}{test_land['status']}{RESET}")
            print(f"  • Total Area: {test_land['total_area']} acres")
            print(f"  • Created: {test_land['created_at']}")
        else:
            print_error(f"Test land (ID: {land_id}) not found in pending queue")
            
        return True
    else:
        print_error(f"Failed to fetch pending lands: {response.status_code} - {response.text}")
        return False

# ============================================================
# STEP 6: Admin Verifies Land
# ============================================================
def admin_verify_land(admin_token, land_id):
    print_step(6, "ADMIN VERIFIES THE LAND")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    print_info(f"Verifying land ID {land_id}...")
    response = requests.post(f"{BASE_URL}/lands/admin/{land_id}/verify/", headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print_success(f"Land verified successfully!")
        print_json(result, "Response")
        print_success("✓ Status should now be 'Vacant'")
        return True
    else:
        print_error(f"Failed to verify land: {response.status_code} - {response.text}")
        print_info("Note: This endpoint requires admin/staff privileges")
        return False

# ============================================================
# STEP 7: Owner Checks Updated Status
# ============================================================
def check_updated_status(owner_token, land_id):
    print_step(7, "OWNER CHECKS UPDATED STATUS")
    
    headers = {"Authorization": f"Bearer {owner_token}"}
    
    print_info("Fetching owner's lands to see updated status...")
    response = requests.get(f"{BASE_URL}/lands/my-lands/", headers=headers)
    
    if response.status_code == 200:
        lands = response.json()
        updated_land = next((land for land in lands if land["id"] == land_id), None)
        
        if updated_land:
            print_success(f"Found land: {updated_land['title']}")
            print(f"\n{BOLD}Updated Land Status:{RESET}")
            print(f"  • ID: {updated_land['id']}")
            print(f"  • Title: {updated_land['title']}")
            print(f"  • Status: {GREEN if updated_land['status'] == 'Vacant' else YELLOW}{updated_land['status']}{RESET}")
            print(f"  • Is Verified: {GREEN if updated_land['is_verified'] else RED}{updated_land['is_verified']}{RESET}")
            print(f"  • Is Flagged: {updated_land['is_flagged']}")
            
            if updated_land['status'] == 'Vacant' and updated_land['is_verified']:
                print(f"\n{GREEN}{BOLD}✓✓✓ SUCCESS! Land status changed to 'Vacant' ✓✓✓{RESET}")
                print_success("The integration is working correctly!")
            else:
                print_error(f"Status did not update as expected")
                print_error(f"Expected: status='Vacant', is_verified=True")
                print_error(f"Got: status='{updated_land['status']}', is_verified={updated_land['is_verified']}")
        else:
            print_error(f"Could not find land with ID {land_id}")
    else:
        print_error(f"Failed to fetch lands: {response.text}")

# ============================================================
# STEP 8: Check Public Listings
# ============================================================
def check_public_listings(land_id):
    print_step(8, "CHECK PUBLIC LISTINGS (LESSEE VIEW)")
    
    print_info("Fetching public land listings (no auth required)...")
    response = requests.get(f"{BASE_URL}/lands/browse/")
    
    if response.status_code == 200:
        lands = response.json()
        print_success(f"Found {len(lands)} public listing(s)")
        
        # Check if our verified land appears
        test_land = next((land for land in lands if land["id"] == land_id), None)
        
        if test_land:
            print(f"\n{GREEN}{BOLD}✓ Test land IS VISIBLE in public listings!{RESET}")
            print(f"  • Lessees can now see and lease this land")
            print(f"  • Title: {test_land['title']}")
            print(f"  • Price: Ksh {test_land['price_per_month']}/month")
        else:
            print_info("Test land not found in public listings")
            print_info("(This is expected if land is not verified)")
    else:
        print_error(f"Failed to fetch public listings: {response.text}")

# ============================================================
# MAIN EXECUTION
# ============================================================
def main():
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}{BLUE}LAND VERIFICATION WORKFLOW TEST{RESET}")
    print(f"{BOLD}{BLUE}Testing Admin ↔ Owner Integration{RESET}")
    print(f"{BOLD}{BLUE}{'='*70}{RESET}\n")
    
    try:
        # Step 1: Login as owner
        owner_token = login_as_owner()
        if not owner_token:
            print_error("Failed to login as owner. Exiting.")
            return
        
        # Step 2: Create land listing
        land_id = create_land_listing(owner_token)
        if not land_id:
            print_error("Failed to create land. Exiting.")
            return
        
        # Step 3: Check initial status (should be Under_Review)
        check_owner_lands(owner_token, land_id)
        
        # Step 4: Login as admin
        admin_token = login_as_admin()
        if not admin_token:
            print_error("Failed to login as admin. Exiting.")
            return
        
        # Step 5: Admin fetches pending lands
        pending_found = admin_fetch_pending(admin_token, land_id)
        
        # Step 6: Admin verifies the land
        if pending_found:
            verified = admin_verify_land(admin_token, land_id)
            
            if verified:
                # Step 7: Owner checks updated status
                check_updated_status(owner_token, land_id)
                
                # Step 8: Check if land appears in public listings
                check_public_listings(land_id)
        
        print(f"\n{BOLD}{GREEN}{'='*70}{RESET}")
        print(f"{BOLD}{GREEN}TEST COMPLETE{RESET}")
        print(f"{BOLD}{GREEN}{'='*70}{RESET}\n")
        
    except Exception as e:
        print_error(f"Error during test: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
