import { defineStore } from 'pinia';
import { auth, signInWithEmailAndPassword, signOut } from '../services/firebase';

interface UserState {
  isLoggedIn: boolean;
  name: string | null;
  email: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      isLoggedIn: false,
      name: null,
      email: null
    };
  },
  actions: {
    initializeAuthListener() {
      return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            // Map Firebase user to userState
            this.isLoggedIn = true;
            this.name = user.displayName;
            this.email = user.email;
          } else {
            // Clear State on logout
            this.$reset();
          }
          resolve(true);
        });
      });
    },

    loginUser(email: string, password: string) {
      return signInWithEmailAndPassword(auth, email, password);
    },

    logoutUser() {
      return signOut(auth);
    },

    logUser() {
      console.log(auth.currentUser);
    }
  }
});
