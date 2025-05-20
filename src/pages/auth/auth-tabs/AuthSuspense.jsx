import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import { Utils } from "@services/utils/utils.service";

const AuthSuspense = () => {
    const [loadingDots, setLoadingDots] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        setIsMobile(Utils.isMobileDevice());
        
        const interval = setInterval(() => {
            setLoadingDots((prev) => {
                if (prev.length >= 3) return "";
                return prev + ".";
            });
        }, 500);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 opacity-70"></div>
            </div>

            {/* Animated grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(to right, #4299e1 1px, transparent 1px)",
                    backgroundSize: isMobile ? "20px 20px" : "40px 40px",
                }}
            ></div>

            {/* Decorative circles - smaller on mobile */}
            <div className={`absolute ${isMobile ? 'top-[10%] left-[10%] w-32 h-32' : 'top-1/4 left-1/4 w-64 h-64'} bg-blue-200 rounded-full filter blur-3xl opacity-20`}></div>
            <div className={`absolute ${isMobile ? 'bottom-[10%] right-[10%] w-40 h-40' : 'bottom-1/4 right-1/4 w-80 h-80'} bg-blue-300 rounded-full filter blur-3xl opacity-20`}></div>

            {/* Main content */}
            <div className={`relative z-10 flex flex-col items-center justify-center gap-${isMobile ? '4' : '8'} px-4`}>
                {/* Logo */}
                <div className="flex items-center justify-center mb-4">
                    <div className={`${isMobile ? 'size-16' : 'size-24'} animate-pulse`}>
                        <img
                            src={assets.logo}
                            alt="Brainet Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Animated gradient text */}
                <div className="text-center">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight animate-text bg-gradient-to-r from-blue-500 via-blue-300 to-blue-600 bg-clip-text text-transparent bg-200%`}>
                        Hello and Welcome to Brainet!
                    </h1>
                    <p className={`mt-${isMobile ? '2' : '4'} ${isMobile ? 'text-base' : 'text-xl'} text-blue-900/70 font-medium`}>
                        Unlock Your Potential with Brainet{loadingDots}
                    </p>
                </div>

                {/* Loading animation */}
                <div className={`mt-${isMobile ? '6' : '8'} flex space-x-2`}>
                    <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-300 animate-bounce`}></div>
                    <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]`}></div>
                    <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]`}></div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuspense;
