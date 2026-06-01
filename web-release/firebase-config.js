const firebaseConfig = {
  apiKey: "AIzaSyASyuErU2lppEUs7K4wp-vCC5MiyA886mE",
  authDomain: "menumatrix-36116.firebaseapp.com",
  projectId: "menumatrix-36116",
  storageBucket: "menumatrix-36116.firebasestorage.app",
  messagingSenderId: "321831241278",
  appId: "1:321831241278:web:3103d7af97257409af736f",
  measurementId: "G-1TPKJVJS3T"
};

window.menuMatrixFirebase = {
  enabled: false,
  error: null
};

try {
  if (!window.firebase) {
    throw new Error("Firebase SDK did not load.");
  }

  const app = window.firebase.apps.length
    ? window.firebase.app()
    : window.firebase.initializeApp(firebaseConfig);
  const auth = window.firebase.auth();
  const db = window.firebase.firestore();
  const authReady = auth.signInAnonymously().catch((error) => {
    window.menuMatrixFirebase.error = error;
    return null;
  });

  window.menuMatrixFirebase = {
    app,
    auth,
    authReady,
    db,
    enabled: true,
    error: null
  };
} catch (error) {
  window.menuMatrixFirebase = {
    enabled: false,
    error
  };
}

window.dispatchEvent(new CustomEvent("menuMatrixFirebaseReady"));
