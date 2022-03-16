import firebaseConfig from '../configs/firebase.json';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

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
