import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@services/firebase/firebase";
import axios from "@services/axios";

class FirebaseAuthService {
    async signInWithGoogle() {
        try {
            // Sign in with Google using Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const payload = result.user.reloadUserInfo;

            const body = {
                provider: "google",
                payload,
            };
            if (payload) {
                const response = await axios.post("/signin", body);
                // Store the token from our backend
                if (response.data && response.data.token) {
                    localStorage.setItem("authToken", response.data.token);
                    return response;
                }
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    }

    // Method to check if user is authenticated with Firebase
    isAuthenticated() {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe();
                resolve(!!user);
            });
        });
    }

    // Sign out from Firebase
    async signOut() {
        try {
            await auth.signOut();
            localStorage.removeItem("authToken");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }
}

export const firebaseAuthService = new FirebaseAuthService();
