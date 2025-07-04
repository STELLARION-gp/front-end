# 🚨 DEBUGGING YOUR AUTH ERROR

## Quick Error Diagnosis

**Open your browser console (F12) and try logging in.** Look for these specific error patterns:

### 1. **Backend Connection Error** 
```
❌ API Error 500: Internal Server Error
❌ Request failed: TypeError: Failed to fetch
```
**Fix:** Make sure your backend is running on `http://localhost:5432`

### 2. **Firebase Configuration Error**
```
❌ Firebase: Error (auth/invalid-api-key)
❌ Firebase: Error (auth/project-not-found)
```
**Fix:** Check your Firebase config in `firebase.ts`

### 3. **CORS Error**
```
❌ Access to fetch at 'http://localhost:5432' from origin 'http://localhost:5173' has been blocked by CORS
```
**Fix:** Add CORS headers to your backend

### 4. **Token/Authentication Error**
```
❌ API Error 401: Unauthorized
❌ API Error 403: Forbidden
```
**Fix:** Check Firebase ID token validation in backend

## 🔧 Quick Test Methods

### Method 1: Enable Debug Mode
In `AuthContext.tsx`, temporarily set:
```tsx
const USE_MOCK_PROFILE = true;  // Line ~58
```
This bypasses both Firebase and backend for pure UI testing.

### Method 2: Test Backend Only
1. Open browser and go to: `http://localhost:5432/health`
2. Should see: `{"message":"Server is running"}`
3. If not, your backend isn't running

### Method 3: Test Firebase Only
In `AuthContext.tsx`, set:
```tsx
const BYPASS_BACKEND = true;  // Line ~60
```
This tests only Firebase authentication.

## 🎯 Most Common Issues & Fixes:

### Issue 1: Backend Not Running
**Symptoms:** "Failed to fetch" errors
**Fix:** 
```bash
cd your-backend-folder
npm start
# Should see: Server running on port 5432
```

### Issue 2: Firebase Users Don't Exist
**Symptoms:** "auth/user-not-found" errors
**Fix:** The auto-creation should handle this, but if not:
```bash
node create-test-users.js
```

### Issue 3: Wrong Firebase Config
**Symptoms:** "auth/invalid-api-key" or similar
**Fix:** Double-check `firebase.ts` config matches your Firebase project

### Issue 4: CORS Issues
**Symptoms:** CORS blocked requests
**Fix:** Add to your backend:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 🚀 Emergency Bypass (For Testing UI Only)

If you just want to test the UI while debugging:

1. **Edit `AuthContext.tsx`** (line ~58):
```tsx
const USE_MOCK_PROFILE = true;  // Changed from false
```

2. **Save and refresh** - you'll be logged in as admin with mock data

3. **Test the UI** to make sure everything else works

4. **Set back to `false`** when ready to fix the real auth

## 📋 Full Debugging Checklist

- [ ] Backend running on port 5432?
- [ ] Can access `http://localhost:5432/health`?
- [ ] Firebase project active and configured?
- [ ] Email/Password auth enabled in Firebase Console?
- [ ] CORS configured in backend?
- [ ] Console shows specific error messages?

## 🆘 If Still Stuck

1. **Copy the exact error message** from browser console
2. **Take a screenshot** of the error
3. **Tell me which step failed** and I'll provide the specific fix

The detailed logging I added will show exactly where the process fails!
