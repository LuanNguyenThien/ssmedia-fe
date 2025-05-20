import { assets, threeD } from "@/assets/assets";
import ForgotPassword from "./ForgotPassword";
import { useState, useEffect } from "react";
import { Utils } from "@services/utils/utils.service";

const ForgotPasswordPage = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(Utils.isMobileDevice());
    }, []);

    // Filter icons for mobile - show fewer on mobile devices
    const getFilteredIcons = () => {
        const icons = [
            {
                icon: threeD[0],
                position: isMobile ? "top-[15%] left-[15%]" : "top-[22%] left-[22%]",
                animation: "animate-float-slow",
                size: isMobile ? "w-[120px] h-[120px]" : "w-[180px] h-[180px]",
                color: "text-blue-400",
            },
            {
                icon: threeD[1],
                position: isMobile ? "top-[10%] -right-[20%]" : "top-[18%] right-[12%]",
                animation: "animate-float-medium",
                size: isMobile ? "w-[130px] h-[130px]" : "w-[190px] h-[190px]",
                color: "text-gray-400",
            },
            {
                icon: threeD[2],
                position: isMobile ? "bottom-[10%] left-[10%]" : "bottom-[15%] left-[18%]",
                animation: "animate-float-fast",
                size: isMobile ? "w-[140px] h-[140px]" : "w-[200px] h-[200px]",
                color: "text-yellow-300",
            },
            {
                icon: threeD[3],
                position: isMobile ? "bottom-[8%] -right-[5%]" : "bottom-[12%] right-[13%]",
                animation: "animate-float-slow",
                size: isMobile ? "w-[125px] h-[125px]" : "w-[185px] h-[185px]",
                color: "text-black/50",
            },
        ];
        
        return icons;
    };

    const socialIcons = getFilteredIcons();

    return (
        <div className="relative flex items-center justify-center min-h-screen w-full bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-lg"></div>
            </div>

            {/* Animated grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        "linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(to right, #4299e1 1px, transparent 1px)",
                    backgroundSize: isMobile ? "20px 20px" : "40px 40px",
                }}
            ></div>

            {/* 3D-style social media icons floating in background */}
            {socialIcons.map((social, index) => (
                <div
                    key={index}
                    className={`absolute ${social.position} transform -translate-x-1/2 -translate-y-1/2 ${social.animation} will-change-transform`}
                >
                    <div
                        className={`flex items-center justify-center ${social.size} ${social.color} transition-all duration-300 hover:scale-110`}
                        style={{
                            filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.1))",
                            willChange: "transform",
                        }}
                    >
                        <div className={`${isMobile ? 'size-[100px]' : 'size-[180px]'}`}>
                            <img
                                src={social.icon}
                                alt="logo"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 py-10">
                {/* Logo header */}
                <div className="text-center mb-4 space-y-2">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-extrabold text-primary-black w-max flex items-center gap-2`}>
                            <div className={`${isMobile ? 'size-12' : 'size-16'}`}>
                                <img
                                    src={assets.logo}
                                    alt="logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-[#1264AB]">BRAINET</span>
                        </span>
                    </div>
                </div>

                {/* Auth form card */}
                <div className="bg-primary-white p-8 rounded-3xl shadow-2xl shadow-blue-500/20 backdrop-blur-sm animate-fade-in">
                    <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center text-gray-800 mb-6`}>
                        Reset Password
                    </h2>

                    <ForgotPassword />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage; 