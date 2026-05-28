# 🔴 Google OAuth Callback Issue - Complete Fix Guide

## Problem
```
[OAuth] Callback params - token: none error: null
```
The token is NOT appearing in the callback URL. This means the backend is not redirecting with the token parameter.

---

## Root Cause
The backend callback was using a **hardcoded HTML page approach** that doesn't work across different hosts/browsers. It needed to be fixed to use URL query parameters.

✅ **FIXED:** Backend now redirects with token in URL: `?token=your_jwt_token`

---

## Step-by-Step Fix

### 1️⃣ Backend Configuration ✅ DONE
The backend callback handler has been updated to:
- Use `process.env.FRONTEND_URL` instead of hardcoded URL
- Pass token as URL query parameter instead of HTML page
- Works with `localhost`, `127.0.0.1`, and other variations

### 2️⃣ Restart Backend Server (REQUIRED!)
```powershell
# Kill current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

**Watch the console for:**
```
[GoogleCallback] Token generated: success
[GoogleCallback] Redirecting to: http://localhost:5173?token=...
```

### 3️⃣ Google Console - Add Missing URLs (STILL REQUIRED!)
Go to: https://console.developers.google.com/

Add these to **Authorized JavaScript origins:**
- ✓ `http://localhost:5173` (already there)
- ❌ **ADD:** `http://127.0.0.1:5173`
- ❌ **ADD:** `http://localhost:3000` (if using different port)

Add these to **Authorized redirect URIs:**
- ✓ `http://localhost:5000/api/auth/google/callback` (already there)
- ❌ **ADD:** `http://127.0.0.1:5000/api/auth/google/callback`

### 4️⃣ Frontend Configuration ✅ DONE
`.env` file is correctly set to:
```
VITE_API_URL=http://localhost:5000/api
```

### 5️⃣ If Using Different Access Methods
**Scenario 1: Using `127.0.0.1` instead of `localhost`**
- Update both `.env` files to use `127.0.0.1`:
  - Frontend: `VITE_API_URL=http://127.0.0.1:5000/api`
  - Backend: `BACKEND_URL=http://127.0.0.1:5000`

**Scenario 2: Using Different Port**
- Frontend: `VITE_API_URL=http://localhost:3000/api` (or whatever port)
- Backend: `PORT=3000`, `BACKEND_URL=http://localhost:3000`

---

## Testing Checklist

After restarting backend:

- [ ] **Test 1:** Visit `http://localhost:5173`
  - Click "Đăng nhập với Google"
  - Complete Google login
  - Check: Console should show `[OAuth] Callback params - token: EXISTS`
  - Result: Should be logged in ✓

- [ ] **Test 2:** Visit `http://127.0.0.1:5173`
  - Click "Đăng nhập với Google"
  - Complete Google login
  - Check: Console should show `[OAuth] Callback params - token: EXISTS`
  - Result: Should be logged in ✓

- [ ] **Test 3:** From Different Browser
  - Open same URL in different browser
  - Repeat login test
  - Result: Should work ✓

---

## Debug Console Logs to Check

**❌ ERROR - Token still not in callback:**
```
[OAuth] Callback params - token: none error: null
```
→ Backend callback not redirecting properly
→ Check backend logs: does it say `[GoogleCallback] Token generated: success`?

**✅ SUCCESS - Token received:**
```
[OAuth] Callback params - token: exists error: null
[OAuth] Saving token to localStorage...
[OAuth] Fetching current user profile...
[OAuth] User profile loaded: {...}
```

**✅ Chrome Security Warning (harmless):**
```
[DOM] Input elements should have autocomplete attributes
```
→ This is just a warning, can add `autocomplete="current-password"` to fix

---

## If Still Not Working

1. **Clear Everything:**
   - Browser cache (Ctrl+Shift+Del)
   - localStorage: Open DevTools → Application → Clear All
   - Restart both frontend and backend

2. **Check Backend Logs:**
   ```
   npm run dev  # Watch the console
   ```
   When you click Google login, you should see:
   ```
   [GET] /api/auth/google
   [GoogleCallback] req.user: {...}
   [GoogleCallback] Token generated: success
   ```

3. **Check Google Console:**
   - Settings saved and take effect (5-15 min)
   - Both localhost and 127.0.0.1 URLs added
   - Client ID and Secret are correct

4. **Check Network Tab:**
   - DevTools → Network tab
   - Look for redirect to google.com
   - Look for redirect back with ?token= parameter

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Token still `none` | Restart backend with `npm run dev` |
| Origin mismatch error | Add frontend URL to Google Console |
| Redirect URI mismatch | Add backend callback URL to Google Console |
| `127.0.0.1` doesn't work | Add `127.0.0.1:port` URLs to Google Console |
| Different browser fails | Same as above - add all variations to Google Console |
| Takes long to load | Normal for first Google OAuth, ~3-5 sec |

---

## Files Changed
- ✅ `backend/controllers/authController.js` - Fixed callback handler
- ✅ `backend/.env` - Added JWT_SECRET
- ✅ `src/services/api.js` - Exported API_URL
- ✅ `src/pages/AuthPage.jsx` - Using dynamic API_URL
- ✅ `src/hooks/useAuth.js` - Removed page reload (earlier fix)

---

## Next Steps
1. **Restart backend** (if not already done)
2. **Add missing URLs** to Google Console
3. **Clear browser cache**
4. **Test login** and check console logs
