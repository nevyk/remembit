import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// firebase configs
const firebaseConfig = {
  apiKey: import.meta.env.REMEMBIT_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.REMEMBIT_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.REMEMBIT_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.REMEMBIT_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.REMEMBIT_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.REMEMBIT_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.REMEMBIT_FIREBASE_MEASUREMENT_ID as string
};

// init firebase
const remembit = initializeApp(firebaseConfig);
const analytics = getAnalytics(remembit);

// init services
const auth = getAuth(remembit);
const db = getFirestore(remembit);

// use emulators on local host
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 9091);
}

// export services
export { auth, signInWithEmailAndPassword, signOut, db };
