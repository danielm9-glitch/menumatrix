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
  const storage = window.firebase.storage ? window.firebase.storage() : null;
  const authReady = new Promise((resolve) => {
    let settled = false;
    let unsubscribe = null;
    const finish = (user = null) => {
      if (settled) return;
      settled = true;
      if (unsubscribe) unsubscribe();
      resolve(user || auth.currentUser || null);
    };

    window.setTimeout(() => finish(auth.currentUser || null), 7000);

    try {
      unsubscribe = auth.onAuthStateChanged(
        (user) => {
          if (user) finish(user);
        },
        (error) => {
          window.menuMatrixFirebase.error = error;
          finish(null);
        }
      );

      if (auth.currentUser) {
        finish(auth.currentUser);
      } else {
        Promise.resolve()
          .then(() => {
            const persistence = window.firebase.auth.Auth.Persistence;
            return auth.setPersistence(persistence.LOCAL).catch(() =>
              auth.setPersistence(persistence.SESSION).catch(() => auth.setPersistence(persistence.NONE))
            );
          })
          .then(() => auth.signInAnonymously())
          .then((credential) => finish(credential.user))
          .catch((error) => {
            window.menuMatrixFirebase.error = error;
            finish(auth.currentUser || null);
          });
      }
    } catch (error) {
      window.menuMatrixFirebase.error = error;
      finish(auth.currentUser || null);
    }
  });

  window.menuMatrixFirebase = {
    app,
    auth,
    authReady,
    db,
    storage,
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
