import firebaseConfig from '../configs/firebase.json';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// init firebase
const remembit = initializeApp(firebaseConfig);
const analytics = getAnalytics(remembit);

//
const auth = getAuth(remembit);

// use emulators on local host
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 9091);
}

// export services
export { auth, signInWithEmailAndPassword, signOut };
