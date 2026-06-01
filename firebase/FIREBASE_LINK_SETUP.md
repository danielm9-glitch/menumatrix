# Menu Matrix Firebase Link Setup

The app now includes the Firebase web config and can sync menu items and design settings with Firestore.

## Firebase Console Steps

1. Open Firebase Console and choose the `menumatrix-36116` project.
2. Go to Build > Authentication.
3. Enable the Anonymous sign-in provider.
4. Go to Build > Firestore Database.
5. Create a database if one does not exist.
6. Open the Firestore Rules tab and use the rules from `firebase/firestore.rules`.

## Current Sync Scope

Synced now:

- Restaurant menu list
- Menu items per restaurant menu
- Design settings

Still local until Firebase Auth is fully added:

- App users
- Passwords
- Permissions

Do not store the current local passwords in Firestore. The next secure step is replacing the local user system with Firebase Authentication and role documents.
