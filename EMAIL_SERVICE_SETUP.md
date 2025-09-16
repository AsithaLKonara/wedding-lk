# Email Service Production Setup Guide

## 📧 Setting Up Email Service for WeddingLK Production

### Step 1: Create Gmail Account for Production
1. Go to https://gmail.com
2. Create a new Gmail account: `weddinglk.noreply@gmail.com`
3. Use a strong password
4. Complete account verification

### Step 2: Enable 2-Factor Authentication
1. Go to Google Account settings
2. Security → 2-Step Verification
3. Enable 2-factor authentication
4. Use authenticator app or SMS

### Step 3: Generate App Password
1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Select "Mail" as the app
4. Generate password (save it securely!)
5. Use this password for SMTP authentication

### Step 4: Configure SMTP Settings
Your WeddingLK platform uses these SMTP settings:

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=weddinglk.noreply@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@weddinglk.com
```

### Step 5: Update Vercel Environment Variables
Go to https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables

Add these environment variables:

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=weddinglk.noreply@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@weddinglk.com
```

### Step 6: Test Email Service
Your platform includes email templates for:
- Welcome emails
- Password reset
- Email verification
- Booking confirmations
- Payment receipts
- Notification alerts

## 🔧 Email Integration Features

### Email Templates:
- `lib/services/email-service.ts` - Email service
- Welcome email template
- Password reset template
- Verification email template
- Booking confirmation template
- Payment receipt template

### Email Types:
1. **Welcome Emails**: New user registration
2. **Verification Emails**: Email address verification
3. **Password Reset**: Password reset links
4. **Booking Confirmations**: Booking confirmations
5. **Payment Receipts**: Payment confirmations
6. **Notifications**: System notifications
7. **Marketing**: Promotional emails

### Email Service Features:
- HTML email templates
- Responsive design
- Attachment support
- Bulk email sending
- Email tracking
- Delivery status

## 📧 Email Template Examples

### Welcome Email:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to WeddingLK</title>
</head>
<body>
    <h1>Welcome to WeddingLK!</h1>
    <p>Thank you for joining our wedding platform.</p>
    <p>Start planning your perfect wedding today!</p>
    <a href="https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app">Visit WeddingLK</a>
</body>
</html>
```

### Booking Confirmation:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation</title>
</head>
<body>
    <h1>Booking Confirmed!</h1>
    <p>Your wedding booking has been confirmed.</p>
    <p>Booking ID: #12345</p>
    <p>Date: January 15, 2024</p>
    <p>Venue: Beautiful Garden Venue</p>
</body>
</html>
```

## 🧪 Testing Email Service

### Test Scenarios:
1. **User Registration**: Test welcome email
2. **Password Reset**: Test reset email
3. **Email Verification**: Test verification email
4. **Booking Confirmation**: Test booking email
5. **Payment Receipt**: Test payment email

### Test Process:
1. Create test user account
2. Trigger email sending
3. Check email delivery
4. Verify email content
5. Test email links

## 📊 Email Analytics

### Tracking Metrics:
- Email delivery rates
- Open rates
- Click-through rates
- Bounce rates
- Unsubscribe rates

### Integration with WeddingLK:
- User engagement tracking
- Email campaign analytics
- Conversion rate monitoring
- User behavior analysis

## 🎯 Next Steps After Email Setup

1. ✅ Email service configured
2. ⏳ Test email functionality
3. ⏳ Test all email templates
4. ⏳ Configure email analytics
5. ⏳ Test booking flow
6. ⏳ Test user registration
7. ⏳ Populate sample data

## 🔗 Useful Links

- [Gmail](https://gmail.com)
- [Google Account Settings](https://myaccount.google.com/)
- [Vercel Environment Variables](https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables)

## 📞 Support

If you encounter issues:
1. Check Gmail account settings
2. Verify app password is correct
3. Test SMTP connection
4. Check Vercel deployment logs
5. Review email service configuration
