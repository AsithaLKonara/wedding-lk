# 🔐 **WeddingLK Authentication & Authorization Test Case Document**

## 📋 **Test Overview**

**Application**: WeddingLK - Wedding Planning Platform  
**Test Environment**: https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app  
**Authentication System**: NextAuth.js with JWT + Google OAuth + 2FA  
**Test Date**: September 8, 2025  
**Total Test Cases**: 45  

---

## 🎯 **1. User Roles & Permissions**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-01** | Verify role creation | 1. Check database → ensure `user`, `vendor`, `wedding_planner`, `admin` roles exist<br>2. Verify role hierarchy and permissions | All 4 roles exist with proper permissions | |
| **AUTH-02** | Assign roles at registration | 1. Register new user via `/api/auth/register`<br>2. Check user object in response<br>3. Verify default role assignment | User defaults to `user` role | |
| **AUTH-03** | Restricted access enforcement | 1. Login as `user` role<br>2. Attempt to access `/api/admin/users`<br>3. Check response status | Response: `403 Forbidden` | |
| **AUTH-04** | Role-based UI rendering | 1. Login as each role (`user`, `vendor`, `planner`, `admin`)<br>2. Navigate to dashboard<br>3. Check visible menu items and features | Only permitted features visible per role | |
| **AUTH-05** | Role escalation prevention | 1. Login as `user`<br>2. Try to modify role via API call<br>3. Attempt to access admin functions | All attempts blocked with `403 Forbidden` | |

---

## 🔑 **2. Authentication Methods**

### **Email/Password Authentication**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-06** | Registration success | 1. POST to `/api/auth/register` with valid data<br>2. Check response status and user creation<br>3. Verify email confirmation sent | Status: `201 Created`<br>User created with `isVerified: false`<br>Confirmation email sent | |
| **AUTH-07** | Registration validation | 1. POST with invalid email format<br>2. POST with weak password<br>3. POST with missing required fields | All return `400 Bad Request` with validation errors | |
| **AUTH-08** | Duplicate email prevention | 1. Register with existing email<br>2. Check response | Status: `409 Conflict`<br>Error: "Email already exists" | |
| **AUTH-09** | Login success | 1. POST to `/api/auth/signin` with valid credentials<br>2. Check JWT token in response<br>3. Verify session creation | Status: `200 OK`<br>JWT token returned<br>Session established | |
| **AUTH-10** | Login failure | 1. POST with invalid password<br>2. POST with non-existent email<br>3. POST with inactive account | All return `401 Unauthorized`<br>Error: "Invalid credentials" | |
| **AUTH-11** | Password reset flow | 1. POST to `/api/auth/forgot-password`<br>2. Check email for reset link<br>3. Click link and set new password<br>4. Login with new password | Reset email sent<br>Password updated successfully<br>New password works for login | |
| **AUTH-12** | Account verification | 1. Register new account<br>2. Click verification link in email<br>3. Check `isVerified` status | Account verified successfully<br>`isVerified: true` | |

### **Google OAuth Authentication**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-13** | Google login success | 1. Click "Login with Google"<br>2. Grant permission in Google popup<br>3. Check redirect and session | Redirect to dashboard<br>Session established<br>User data populated | |
| **AUTH-14** | Google login denied | 1. Click "Login with Google"<br>2. Deny permission in popup<br>3. Check error handling | Redirect to error page<br>Error: "Google login cancelled" | |
| **AUTH-15** | Link to existing account | 1. Login with Google using existing email<br>2. Check account linking<br>3. Verify social account data | Account linked successfully<br>Social account data stored | |
| **AUTH-16** | New user via Google | 1. Login with Google using new email<br>2. Check user creation<br>3. Verify default role assignment | New user created with `user` role<br>Social account linked | |

### **Two-Factor Authentication (2FA)**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-17** | Enable 2FA | 1. Login to account<br>2. Navigate to security settings<br>3. Click "Enable 2FA"<br>4. Scan QR code with authenticator app<br>5. Enter verification code | 2FA enabled successfully<br>QR code generated<br>Backup codes provided | |
| **AUTH-18** | 2FA verification success | 1. Login with credentials<br>2. Enter correct OTP from authenticator<br>3. Check access granted | Access granted<br>Redirect to dashboard | |
| **AUTH-19** | 2FA verification failure | 1. Login with credentials<br>2. Enter incorrect OTP<br>3. Check error handling | Error: "Invalid OTP"<br>Access denied | |
| **AUTH-20** | Backup codes usage | 1. Login with credentials<br>2. Use backup code instead of OTP<br>3. Check access granted | Access granted with backup code | |
| **AUTH-21** | Disable 2FA | 1. Login with 2FA enabled<br>2. Navigate to security settings<br>3. Disable 2FA with verification<br>4. Login without 2FA | 2FA disabled successfully<br>Login works without OTP | |

---

## 🔄 **3. Session & Token Management**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-22** | JWT token issuance | 1. Login successfully<br>2. Check response headers<br>3. Verify token structure | JWT token in response<br>Token contains user data and role | |
| **AUTH-23** | Token expiration | 1. Login and get token<br>2. Wait for token expiry (or modify expiry)<br>3. Make API call with expired token | Response: `401 Unauthorized`<br>Error: "Token expired" | |
| **AUTH-24** | Token refresh | 1. Login and get token<br>2. Call `/api/auth/refresh` before expiry<br>3. Check new token issued | New JWT token issued<br>Extended session time | |
| **AUTH-25** | Logout functionality | 1. Login successfully<br>2. Call `/api/auth/signout`<br>3. Attempt API call after logout | Session invalidated<br>API calls return `401 Unauthorized` | |
| **AUTH-26** | Session persistence | 1. Login and close browser<br>2. Reopen browser and visit app<br>3. Check if still logged in | Session persists across browser sessions | |
| **AUTH-27** | Multiple device sessions | 1. Login on device A<br>2. Login on device B<br>3. Check both sessions active | Both sessions remain active | |

---

## 🛡️ **4. Security Validations**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-28** | Rate limiting | 1. Attempt 10 failed logins rapidly<br>2. Check rate limit response<br>3. Wait and try again | After 5 attempts: `429 Too Many Requests`<br>Rate limit resets after window | |
| **AUTH-29** | SQL injection prevention | 1. Try login with `' OR '1'='1`<br>2. Try registration with SQL injection<br>3. Check database queries | All requests sanitized<br>No SQL injection possible | |
| **AUTH-30** | XSS prevention | 1. Enter `<script>alert(1)</script>` in forms<br>2. Check input sanitization<br>3. Verify output encoding | Input sanitized<br>No script execution | |
| **AUTH-31** | HTTPS enforcement | 1. Try accessing HTTP URL<br>2. Check redirect behavior<br>3. Verify secure cookies | Redirect to HTTPS<br>Secure cookies only | |
| **AUTH-32** | Password hashing | 1. Register new user<br>2. Check database password field<br>3. Verify bcrypt hash | Password stored as bcrypt hash<br>Not plain text | |
| **AUTH-33** | CSRF protection | 1. Make API call without CSRF token<br>2. Check CSRF validation<br>3. Verify token requirement | CSRF token required<br>Invalid tokens rejected | |
| **AUTH-34** | Input validation | 1. Send malformed JSON<br>2. Send oversized payload<br>3. Send invalid data types | All requests validated<br>Invalid data rejected | |

---

## 🔌 **5. API Authentication**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-35** | Public API access | 1. Call `/api/search` without authentication<br>2. Call `/api/vendors` without auth<br>3. Check response | Status: `200 OK`<br>Public data returned | |
| **AUTH-36** | Protected API access | 1. Call `/api/favorites` without auth<br>2. Call `/api/bookings` without auth<br>3. Check response | Status: `401 Unauthorized`<br>Error: "Authentication required" | |
| **AUTH-37** | User API access | 1. Login as `user`<br>2. Call `/api/favorites`<br>3. Call `/api/bookings`<br>4. Call `/api/vendors` (POST) | All user APIs return `200 OK`<br>Vendor creation blocked | |
| **AUTH-38** | Vendor API access | 1. Login as `vendor`<br>2. Call `/api/vendor/profile`<br>3. Call `/api/vendor/services`<br>4. Call `/api/admin/users` | Vendor APIs work<br>Admin APIs return `403 Forbidden` | |
| **AUTH-39** | Admin API access | 1. Login as `admin`<br>2. Call `/api/admin/users`<br>3. Call `/api/admin/analytics`<br>4. Call `/api/admin/bulk` | All admin APIs return `200 OK` | |
| **AUTH-40** | Invalid token handling | 1. Call API with malformed JWT<br>2. Call API with expired token<br>3. Call API with no token | All return `401 Unauthorized` | |

---

## 🖥️ **6. Frontend Authentication Flows**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-41** | Session persistence | 1. Login and refresh browser<br>2. Check if still logged in<br>3. Navigate to protected pages | Session persists<br>No re-login required | |
| **AUTH-42** | Expired session handling | 1. Stay logged in until session expires<br>2. Try to access protected page<br>3. Check redirect behavior | Redirect to login page<br>Session expired message | |
| **AUTH-43** | Unauthorized page access | 1. Visit `/admin` as `user`<br>2. Visit `/vendor/dashboard` as `user`<br>3. Check redirect behavior | Redirect to appropriate page<br>403 error or login redirect | |
| **AUTH-44** | Multi-language support | 1. Switch to Sinhala language<br>2. Check login page text<br>3. Switch to Tamil language<br>4. Verify text changes | Login page text changes<br>All auth messages translated | |

---

## 📊 **7. Audit & Logging**

| **TC ID** | **Test Case** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|---------------|-----------|-------------------|---------------|
| **AUTH-45** | Login attempt logging | 1. Attempt successful login<br>2. Attempt failed login<br>3. Check audit logs<br>4. Verify log details | Both events logged with timestamps<br>IP addresses and user agents recorded | |
| **AUTH-46** | Admin audit access | 1. Login as admin<br>2. Navigate to audit panel<br>3. Check log visibility<br>4. Verify log filtering | Audit logs visible to admin<br>Filtering and search working | |
| **AUTH-47** | Suspicious activity detection | 1. Attempt 5 failed logins<br>2. Try multiple failed 2FA attempts<br>3. Check security alerts | Suspicious activity flagged<br>Rate limiting activated | |
| **AUTH-48** | GDPR compliance | 1. User requests account deletion<br>2. Check data removal<br>3. Verify audit trail | Account and data removed<br>Deletion logged in audit | |

---

## 🧪 **8. Test Execution Commands**

### **API Testing Commands**

```bash
# Test Authentication APIs
curl -X POST https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test Role-based Access
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/api/admin/users

# Test 2FA Setup
curl -X POST https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/api/auth/2fa/setup \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Test Rate Limiting
for i in {1..10}; do
  curl -X POST https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'
done
```

### **Frontend Testing URLs**

```bash
# Test Authentication Pages
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/auth/signin
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/auth/signup
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/auth/error

# Test Role-based Dashboards
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/dashboard/user
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/dashboard/vendor
https://wedding-etxqdl4qk-asithalkonaras-projects.vercel.app/dashboard/admin
```

---

## ✅ **Test Execution Checklist**

- [ ] **Environment Setup**: Verify test environment is accessible
- [ ] **Test Data**: Prepare test users for each role
- [ ] **API Keys**: Ensure Google OAuth credentials are configured
- [ ] **Database**: Verify MongoDB connection and test data
- [ ] **2FA Setup**: Configure authenticator app for 2FA tests
- [ ] **Monitoring**: Set up logging and monitoring for test execution
- [ ] **Documentation**: Record all test results and failures
- [ ] **Cleanup**: Remove test data after completion

---

## 📈 **Success Criteria**

- **Pass Rate**: ≥ 95% of test cases must pass
- **Security**: All security validations must pass 100%
- **Performance**: Authentication responses < 2 seconds
- **Reliability**: No false positives or negatives
- **Coverage**: All authentication flows tested

---

**Test Document Version**: 1.0  
**Last Updated**: September 8, 2025  
**Prepared By**: AI Assistant  
**Review Status**: Ready for Execution

