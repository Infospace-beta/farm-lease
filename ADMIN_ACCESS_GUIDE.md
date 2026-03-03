# 🔧 ADMIN CONSOLE ACCESS GUIDE

## ✅ ISSUE RESOLVED

Your backend and frontend are **properly connected**! The "issue" is simply that you need to log in with an **admin account** to access the Admin Console.

---

## 📊 CURRENT STATUS

Based on database check:

- ✅ **7 lands** in the database
- ✅ **1 land pending verification**: "Tiret Plot" (uploaded by owner@gmail.com)
- ✅ **6 verified lands**
- ✅ **2 admin accounts** available
- ✅ **Backend responding correctly** on all endpoints
- ✅ **Frontend properly configured**

---

## 🔐 HOW TO ACCESS ADMIN CONSOLE

### STEP 1: Logout from Current Account
1. Click on your profile/avatar
2. Select "Logout"

### STEP 2: Login as Admin
Go to: `http://localhost:3000/login`

Use ONE of these admin accounts:

**Option 1: Super Admin**
- Email: `admin@gmail.com`
- Role: `admin` (superuser)

**Option 2: Test Admin**
- Email: `test_admin@farmleasetest.com`
- Role: `admin`

### STEP 3: View Land Verifications
After login, you'll be automatically redirected to:
`http://localhost:3000/admin/land-verifications`

You should see:
- Dashboard with stats (1 pending, 6 verified)
- List of all lands
- "Tiret Plot" in the pending verification section
- Buttons to "Verify" or "Flag" each land

---

## 🎯 KEY POINTS

### User Roles Explained

| Role | Dashboard Path | Can Upload Land | Can Verify Land |
|------|---------------|-----------------|-----------------|
| `landowner` | `/owner` | ✅ Yes | ❌ No |
| `farmer` | `/lessee` | ❌ No | ❌ No |
| `dealer` | `/dealer` | ❌ No | ❌ No |
| `admin` | `/admin` | ❌ No | ✅ Yes |

### What Happened

1. You uploaded land as `owner@gmail.com` (landowner role)
2. The land was saved to database successfully ✅
3. You tried to view it in Admin Console
4. But you were still logged in as `owner@gmail.com` (not admin)
5. Admin endpoints require `is_staff=True` (admin role)

---

## 🔍 VERIFICATION WORKFLOW

```
┌─────────────────┐
│ Landowner       │
│ Uploads Land    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status:         │
│ Under_Review    │
│ is_verified:    │
│ false           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Admin Reviews   │
│ in Admin Console│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│APPROVE│  │ FLAG  │
└───┬───┘  └───┬───┘
    │          │
    ▼          ▼
┌────────┐  ┌────────┐
│Vacant  │  │Flagged │
│Verified│  │Reason  │
└────────┘  └────────┘
```

---

## 🧪 TEST COMMANDS (For Developers)

Located in `backend/farmlease/`:

1. **Check Database**:
   ```
   py check_lands.py
   ```

2. **Test Admin Endpoints**:
   ```
   py test_admin_endpoints.py
   ```

3. **Comprehensive Test**:
   ```
   py comprehensive_test.py
   ```

---

## ⚙️ CONFIGURATION

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
✅ Already configured!

### Backend URLs
```python
# Admin endpoints
/api/lands/admin/all/       # List all lands
/api/lands/admin/stats/     # Get statistics
/api/lands/admin/{id}/verify/   # Verify a land
/api/lands/admin/{id}/flag/     # Flag a land
```

---

## 📝 QUICK REFERENCE

### Admin Account Credentials

Ask your system administrator for admin credentials, or if you're the developer:

```python
# In Django shell
from accounts.models import User

# Create admin user
User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='your_password',
    role='admin',
    phone_number='1234567890'
)
```

---

## ❓ TROUBLESHOOTING

### Issue: Can't see lands in Admin Console

**Solution**: Log in as admin user (not landowner)

### Issue: 404 Error on admin endpoints

**Checklist**:
- [ ] Backend server running? (`py manage.py runserver`)
- [ ] Logged in as admin? (check role in profile)
- [ ] CORS enabled in Django settings?
- [ ] Frontend .env.local configured?

### Issue: Permissions error

**Check**:
```python
# In Django shell
user = User.objects.get(email='your_admin@email.com')
print(f"is_staff: {user.is_staff}")
print(f"role: {user.role}")
```

Both should be True/'admin'

---

## ✨ SUCCESS!

Everything is working correctly. Just log in with an admin account and you'll see all pending land verifications!

**Need Help?**
- Check browser console (F12) for errors
- Check Django server logs for backend errors
- Verify you're using correct admin credentials
