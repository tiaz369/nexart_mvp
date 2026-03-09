# Firebase Setup Guide for NexArt

This guide will help you set up Firebase for the NexArt platform.

## Prerequisites

- Google Account
- Firebase project

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: **nexart-mvp**
4. Click "Continue"
5. Disable Google Analytics (optional for MVP)
6. Click "Create project"
7. Wait for project creation to complete
8. Click "Continue"

## Step 2: Register Your Web App

1. In Firebase Console, click the **web icon** (`</>`) to add a web app
2. Enter app nickname: **NexArt Web**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Update Firebase Configuration

1. Open `js/firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Click on **Email/Password** provider
4. Toggle "Enable"
5. Click "Save"

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click "Create database"
3. Select "Start in **test mode**" (for development)
4. Choose a Cloud Firestore location (closest to your users)
5. Click "Enable"

### Firestore Security Rules (Test Mode - Development Only)

**WARNING:** Test mode rules allow anyone to read/write your database. Update before production!

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 1);
    }
  }
}
```

### Recommended Production Security Rules

Before launch, update to these production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Artworks collection
    match /artworks/{artworkId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.artistId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.artistId == request.auth.uid;
    }

    // Saves collection
    match /saves/{saveId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can apply
      allow update: if request.auth != null; // Only authenticated users (admins)
    }
  }
}
```

## Step 6: Set Up Firebase Storage

1. In Firebase Console, go to **Build → Storage**
2. Click "Get started"
3. Select "Start in **test mode**" (for development)
4. Choose a Cloud Storage location (same as Firestore)
5. Click "Done"

### Storage Security Rules (Test Mode - Development Only)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 1);
    }
  }
}
```

### Recommended Production Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /artworks/{userId}/{artworkId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Create Firestore Collections

Firebase will automatically create collections when you first write data. The following collections will be created:

- **users**: User profiles
- **artworks**: Artwork uploads
- **saves**: User saved artworks
- **applications**: Artist applications

## Step 8: Set Up Admin Access

1. Open `js/admin.js`
2. Find line 14: `const ADMIN_EMAIL = 'your-admin-email@example.com';`
3. Replace with your actual admin email address
4. Save the file

## Step 9: Test Your Setup

1. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Or using Node.js http-server
   npx http-server
   ```

2. Open browser: `http://localhost:8000`

3. Test authentication:
   - Click "Login" in navigation
   - Create a new account
   - Check Firebase Console → Authentication → Users

4. Test as Artist:
   - Sign up as "Artist"
   - Upload an artwork
   - Check Firebase Console → Firestore → artworks
   - Check Firebase Console → Storage → artworks

5. Test as Viewer:
   - Sign up as "Collector / Art Enthusiast"
   - View Gallery
   - Save an artwork
   - Check Dashboard

## Troubleshooting

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"
- This means Firebase is being initialized multiple times
- Check that you're only including `firebase-config.js` once per page

### Error: "Missing or insufficient permissions"
- Check Firestore Security Rules
- Make sure you're in test mode for development
- Verify user is authenticated

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Enable Email/Password authentication in Firebase Console
- Go to Authentication → Sign-in method

### Images not uploading
- Check Firebase Storage is enabled
- Verify Storage Security Rules
- Check file size (max 5MB in code)

## Next Steps

1. **Update security rules** before launch (see production rules above)
2. **Set up Firebase Hosting** (optional):
   ```bash
   firebase init hosting
   firebase deploy
   ```
3. **Monitor usage** in Firebase Console → Usage and billing
4. **Set up Firebase Functions** for server-side operations (future enhancement)

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Security](https://firebase.google.com/docs/storage/security)
- [Firebase Pricing](https://firebase.google.com/pricing)

## Firebase Free Tier Limits

- **Authentication**: Unlimited users
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Hosting**: 10GB storage, 360MB/day bandwidth

Perfect for MVP and early testing!
