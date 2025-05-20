import "@pages/auth/reset-password/ResetPassword.scss";
import { authService } from "@services/api/auth/auth.service";
import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [searchParams] = useSearchParams();

    const resetPassword = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const body = { password, confirmPassword };
            const response = await authService.resetPassword(
                searchParams.get("token"),
                body
            );
            setLoading(false);
            setPassword("");
            setConfirmPassword("");
            setShowAlert(true);
            setAlertType("success");
            setResponseMessage(response?.data?.message || "Password reset successfully!");
        } catch (error) {
            setAlertType("error");
            setLoading(false);
            setShowAlert(true);
            setResponseMessage(error?.response?.data?.message || "Failed to reset password");
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="w-full">
            {showAlert && responseMessage && (
                <div 
                    className={`text-sm p-3 mb-6 rounded-lg ${
                        alertType === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"
                    }`} 
                    role="alert"
                >
                    {responseMessage}
                </div>
            )}
            
            <form onSubmit={resetPassword} className="space-y-1">
                <div className="group">
                    <label className="block text-xs font-medium text-primary mb-2 transition duration-300 group-focus-within:text-primary">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-primary" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                        <button 
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                            onClick={handleTogglePassword}
                            tabIndex="-1"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
                </div>

                <div className="group">
                    <label className="block text-xs font-medium text-primary mb-2 transition duration-300 group-focus-within:text-primary">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-primary" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                        <button 
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                            onClick={handleToggleConfirmPassword}
                            tabIndex="-1"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Both passwords must match</p>
                </div>
                
                <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-lg hover:from-primary hover:to-primary/80 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Resetting password...</span>
                        </div>
                    ) : (
                        "Reset Password"
                    )}
                </button>
                
                <Link 
                    to="/" 
                    className="flex items-center justify-center mt-8 text-sm text-primary hover:text-primary focus:outline-none px-4 py-2 rounded-full hover:bg-primary/5 transition-colors"
                    tabIndex="0"
                    aria-label="Return to login page"
                >
                    <FaArrowLeft className="mr-2" />
                    <span>Back to login</span>
                </Link>
            </form>
        </div>
    );
};

export default ResetPassword;
