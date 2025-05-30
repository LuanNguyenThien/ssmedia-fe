import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@pages/auth/login/Login.scss";

import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { authService } from "@services/api/auth/auth.service";
import { Utils } from "@services/utils/utils.service";
import { firebaseAuthService } from "@services/api/auth/firebase-auth.service";
import { FcGoogle } from "react-icons/fc";

const Login = ({ onSwitchToRegister, isMobile }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [user, setUser] = useState();
    const [setStoredUsername] = useLocalStorage("username", "set");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [pageReload] = useSessionStorage("pageReload", "set");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isBan, setIsBan] = useState(false);

    const loginUser = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const result = await authService.signIn({
                provider: "local",
                username,
                password,
            });

            const ban = await authService.CheckUser(result.data.user.authId);
            setIsBan(ban.data.isBanned);
            setLoggedIn(keepLoggedIn);
            setStoredUsername(username);
            setHasError(false);
            setAlertType("alert-success");
            Utils.dispatchUser(result, pageReload, dispatch, setUser);
        } catch (error) {
            setLoading(false);
            setHasError(true);
            setAlertType("alert-error");
            setErrorMessage(error?.response?.data.message);
        }
    };

    const handleGoogleSignIn = async () => {
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
            setLoggedIn(keepLoggedIn);
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
        else if (user) navigate("/app/social/streams");
    }, [loading, user, navigate, isBan]);

    return (
        <div className="w-full">
            <form onSubmit={loginUser} className={`space-y-${isMobile ? '0.5' : '1'}`}>
                <div className="group">
                    <label className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-primary-black/60 mb-2 transition duration-300 group-focus-within:text-primary-700`}>
                        Email or Username
                    </label>
                    <div className="relative">
                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-primary" />
                        </div> */}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="youremail@example.com"
                            className={`w-full px-4 ${isMobile ? 'py-2.5' : 'py-3'} border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm ${isMobile ? 'text-sm' : ''}`}
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <div className="flex justify-between items-center mb-2">
                        <label className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-primary-black/60 transition duration-300 group-focus-within:text-primary-700`}>
                            Password
                        </label>
                        <Link
                            to="/forgot-password"
                            className={`${isMobile ? 'text-xs' : 'text-sm'} text-primary-black/60 hover:text-primary-black transition duration-300 hover:underline`}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-primary" />
                        </div> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-4 ${isMobile ? 'py-2.5' : 'py-3'} border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm ${isMobile ? 'text-sm' : ''}`}
                            required
                        />
                    </div>
                </div>
                {hasError && errorMessage && (
                    <div
                        className={`${isMobile ? 'text-xs' : 'text-sm'} p-3 mb-6 rounded-lg ${
                            alertType === "alert-error"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                )}

                <label className="w-fit flex items-center cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                            className="sr-only"
                        />
                        <div className="w-5 h-5 bg-white border border-gray-300 rounded transition duration-200 group-hover:border-primary-400"></div>
                        <div
                            className={`absolute top-0 left-0 w-5 h-5 flex items-center justify-center transition-opacity duration-200 ${
                                keepLoggedIn ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <svg
                                className="w-3.5 h-3.5 text-primary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                            </svg>
                        </div>
                    </div>
                    <span className={`ml-2 ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 group-hover:text-gray-800 transition duration-200`}>
                        Remember me
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-${isMobile ? '4' : '6'} bg-gradient-to-r from-primary to-primary/80 text-white ${isMobile ? 'py-2.5 text-sm' : 'py-3'} px-4 rounded-lg hover:from-primary hover:to-primary/80 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
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
                            <span>Logging in...</span>
                        </div>
                    ) : (
                        "Log In"
                    )}
                </button>

                <div className={`mt-${isMobile ? '3' : '6'} text-center`}>
                    <div className={`relative flex items-center ${isMobile ? 'my-3' : 'my-6'}`}>
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className={`${isMobile ? 'text-xs' : 'text-sm'} flex-shrink mx-4 text-gray-600`}>
                            or continue with
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className={`w-full ${isMobile ? 'py-2.5 text-sm' : 'py-3'} bg-white border border-gray-300 rounded-lg text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                    >
                        <FcGoogle className="mr-2 text-2xl" />
                        Sign in with Google
                    </button>

                    <div className={`mt-${isMobile ? '4' : '6'} text-center`}>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-primary hover:underline focus:outline-none`}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

Login.propTypes = {
    onSwitchToRegister: PropTypes.func,
    isMobile: PropTypes.bool,
};

export default Login;
