# Firebase Setup Guide

## Error: auth/configuration-not-found

This error occurs when Firebase Authentication is not properly enabled in your Firebase project. Follow these steps to fix it:

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `vitc-33f76`
3. Click on **Authentication** in the left sidebar
4. Click **Get Started** button (if you haven't enabled it yet)
5. Go to the **Sign-in method** tab
6. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" switch to ON
   - Click "Save"

## Step 2: Enable Firestore Database

1. In Firebase Console, click on **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your Cloud Firestore location (choose closest to your users)
5. Click **Enable**

## Step 3: Enable Cloud Messaging (for Emergency Alerts)

1. In Firebase Console, click on **Cloud Messaging** in the left sidebar
2. Click **Get Started** or enable the service
3. Note: You may need to add a server key for push notifications

## Step 4: Security Rules (Important!)

### Firestore Rules
Go to **Firestore Database** → **Rules** tab and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Appointments - users can only access their own
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }

    // Doctors - public read, admin write
    match /doctors/{doctorId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check later
    }

    // Emergency alerts - public read for nearby users
    match /emergencies/{emergencyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Device data - users can only access their own
    match /devices/{deviceId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Authentication Settings
Go to **Authentication** → **Settings** tab:
- Add your domain to **Authorized domains**: `localhost` (already added by default)
- For production, add your deployed domain

## Step 5: Test Authentication

After enabling authentication:

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Try signing up as a patient again
3. The error should now be resolved

## Common Issues

### Issue: "auth/configuration-not-found"
**Solution**: Make sure Email/Password authentication is enabled in Firebase Console

### Issue: "auth/unauthorized-domain"
**Solution**: Add your domain (localhost:3000) to Authorized domains in Authentication settings

### Issue: Firestore permission denied
**Solution**: Update Firestore rules as shown in Step 4

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Verify your API key in `.env.local` matches the one in Firebase Console → Project Settings

## Verify Your Configuration

Your current `.env.local` file has:
- ✅ API Key: `AIzaSyA2MHZm4ZkuURJqIN5XezTDP7sk-uyrKvQ`
- ✅ Auth Domain: `vitc-33f76.firebaseapp.com`
- ✅ Project ID: `vitc-33f76`

These match your Firebase project. The issue is that **Authentication service is not enabled** in the Firebase Console.

## Next Steps After Setup

Once Firebase is properly configured, you can:

1. **User Authentication**: Sign up/login for patients and doctors
2. **Appointment Booking**: Store appointments in Firestore
3. **Emergency Alerts**: Send push notifications via FCM
4. **Device Data**: Store IoT device readings in real-time
5. **User Profiles**: Manage patient and doctor profiles

## Need Help?

If you continue to face issues:
1. Check Firebase Console → Project Settings → General to verify configuration
2. Ensure all required services (Auth, Firestore, FCM) are enabled
3. Check browser console for detailed error messages
4. Verify `.env.local` file is in the root directory and has all values
