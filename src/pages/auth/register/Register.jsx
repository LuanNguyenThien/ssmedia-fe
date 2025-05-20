import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { firebaseAuthService } from "@/services/api/auth/firebase-auth.service";
import { Utils } from "@services/utils/utils.service";
import { authService } from "@services/api/auth/auth.service";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { FcGoogle } from "react-icons/fc";

export default function Register({ onSwitchToLogin }) {
    const isMobile = Utils.isMobileDevice();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState();
    const [setStoredUsername] = useLocalStorage("username", "set");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [pageReload] = useSessionStorage("pageReload", "set");
    const [isBan, setIsBan] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerUser = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const avatarColor = Utils.avatarColor();
            const avatarImage = Utils.generateAvatar(
                username.charAt(0).toUpperCase(),
                avatarColor
            );
            const result = await authService.signUp({
                username,
                email,
                password,
                avatarColor,
                avatarImage,
            });
            setLoggedIn(true);
            setStoredUsername(username);
            setAlertType("alert-success");
            Utils.dispatchUser(result, pageReload, dispatch, setUser);
        } catch (error) {
            setLoading(false);
            setHasError(true);
            setAlertType("alert-error");
            setErrorMessage(error?.response?.data?.message);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setHasError(false);
        try {
            const result = await firebaseAuthService.signInWithGoogle();

            // Check if user is banned
            if (result.data && result.data.user && result.data.user.authId) {
                const ban = await authService.CheckUser(
                    result.data.user.authId
                );
                setIsBan(ban.data.isBanned);
            }

            // Set login state
            setLoggedIn(true);
            if (result.data && result.data.user && result.data.user.username) {
                setStoredUsername(result.data.user.username);
            }

            // Dispatch user data to Redux
            Utils.dispatchUser(result, pageReload, dispatch, setUser);
        } catch (error) {
            setLoading(false);
            setHasError(true);
            setAlertType("alert-error");
            setErrorMessage(error?.message || "Failed to sign in with Google");
        }
    };

    useEffect(() => {
        if (loading && !user) return;
        if (isBan) navigate("/checkpoint");

        if (user) navigate("/app/social/streams");
    }, [loading, user, navigate]);

    return (
        <div className="w-full">
            <form onSubmit={registerUser} className="space-y-1">
                <div className="group">
                    <label className="block text-sm font-semibold text-primary-black/60 mb-2 transition duration-300 group-focus-within:text-primary">
                        Username
                    </label>
                    <div className="relative">
                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-primary" />
                        </div> */}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            className="w-full px-4 py-3 border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-semibold text-primary-black/60 mb-2 transition duration-300 group-focus-within:text-primary">
                        Email
                    </label>
                    <div className="relative">
                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-primary" />
                        </div> */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-semibold text-primary-black/60 mb-2 transition duration-300 group-focus-within:text-primary">
                        Password
                    </label>
                    <div className="relative">
                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-primary" />
                        </div> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters
                    </p>
                </div>
                {hasError && errorMessage && (
                    <div
                        className={`text-sm p-3 mb-6 rounded-lg ${
                            alertType === "alert-error"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-lg hover:from-primary hover:to-primary/80 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        "Sign Up"
                    )}
                </button>

                <div className="flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className={`w-full ${
                        isMobile ? "py-2.5 text-sm" : "py-3"
                    } bg-white border border-gray-300 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                >
                    <FcGoogle className="mr-2 text-2xl" />
                    Sign in with Google
                </button>
            </form>

            <div className="mt-8 text-center">
                <p
                    className={`${
                        isMobile ? "text-xs" : "text-sm"
                    } text-gray-600`}
                >
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className={`${
                            isMobile ? "text-xs" : "text-sm"
                        } font-semibold text-primary hover:underline focus:outline-none`}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

Register.propTypes = {
    onSwitchToLogin: PropTypes.func.isRequired,
};
