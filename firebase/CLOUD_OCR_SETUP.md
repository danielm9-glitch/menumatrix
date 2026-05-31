# Cloud OCR Setup

This replaces the unreliable browser OCR scanner with a Firebase Cloud Function that calls Google Cloud Vision.

## 1. Create Or Select Firebase Project

Use Firebase Console and create a project for this app.

## 2. Enable Required Services

Enable:

- Cloud Firestore
- Firebase Authentication
- Firebase Storage
- Cloud Functions
- Google Cloud Vision API
- Billing for the Google Cloud project

Cloud Vision and Cloud Functions usually require billing to be enabled.

## 3. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## 4. Deploy The OCR Function

From this folder:

```bash
cd firebase
npm install --prefix functions
firebase use --add
firebase deploy --only functions:scanMenuPhoto
```

After deployment, Firebase prints a function URL like:

```text
https://scanmenuphoto-xxxxx-uc.a.run.app
```

## 5. Add Function URL To The Web App

Open:

```text
ocr-config.js
```

Set:

```js
window.MENU_MATRIX_OCR_ENDPOINT = "https://your-function-url";
```

Then upload the updated `index.html`, `styles.css`, `app.js`, and `ocr-config.js` to GitHub Pages.

## Important Security Note

The starter function allows public POST requests so the prototype can work from GitHub Pages.
Before production, require Firebase Auth or App Check so strangers cannot use your OCR endpoint.

