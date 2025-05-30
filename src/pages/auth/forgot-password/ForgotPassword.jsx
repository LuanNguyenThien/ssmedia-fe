import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import "@pages/auth/forgot-password/ForgotPassword.scss";
import { authService } from "@services/api/auth/auth.service";
import { Link } from "react-router-dom";
import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const forgotPassword = async () => {
        setLoading(true);
        try {
            const response = await authService.forgotPassword(email);
            setLoading(false);
            setEmail("");
            setShowAlert(true);
            setAlertType("success");
            setResponseMessage(response?.data?.message || "Reset link sent successfully!");
        } catch (error) {
            setAlertType("error");
            setLoading(false);
            setShowAlert(true);
            setResponseMessage(error?.response?.data?.message || "Failed to send reset link");
        }
    };

    const sendLinkEmail = (event) => {
        event.preventDefault();
        forgotPassword();
    };

    return (
        <div className="w-full">
            {showAlert && (
                <div 
                    className={`text-sm p-3 mb-6 rounded-lg ${
                        alertType === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"
                    }`} 
                    role="alert"
                >
                    {responseMessage}
                </div>
            )}
            
            <form onSubmit={sendLinkEmail} className="space-y-1">
                <div className="group">
                    <label className="block text-xs font-medium text-primary mb-2 transition duration-300 group-focus-within:text-primary">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-primary" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition duration-200 hover:bg-white shadow-sm"
                            required
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-600">We'll send a password reset link to this email address</p>
                </div>
                
                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-lg hover:from-primary hover:to-primary/80 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending link...</span>
                        </div>
                    ) : (
                        "Send Reset Link"
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

export default ForgotPassword;
