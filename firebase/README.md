# Firebase Database Setup

This folder starts the real shared database version of the menu app.

## Collections

- `menuItems`: public menu data and training notes
- `users`: admin/editor permissions
- `appSettings`: global colors and header image

## What Firebase Will Replace

The current app uses browser `localStorage`. Firebase will make the data shared across devices:

- Menu edits sync everywhere
- Admin users work across devices
- Uploaded photos can be stored in Firebase Storage
- Color/theme settings sync for everyone

## First Setup Steps

1. Create a Firebase project.
2. Enable Authentication with Email/Password.
3. Create Firestore Database.
4. Create Firebase Storage.
5. Add the fields from `seed-data.json`.
6. Publish `firestore.rules` in Firebase Console.

## Important

The app is not connected to Firebase yet. These files prepare the database structure. The next coding step is wiring `app.js` to Firebase Auth, Firestore, and Storage.

## Cloud OCR

The `functions` folder includes a `scanMenuPhoto` Cloud Function that uses Google Cloud Vision OCR.
See `CLOUD_OCR_SETUP.md` for deployment steps.
