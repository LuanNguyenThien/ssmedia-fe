import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "@pages/auth/login/Login";
import Register from "@pages/auth/register/Register";
import useLocalStorage from "@hooks/useLocalStorage";
import { assets, threeD } from "@/assets/assets";
import useIsMobile from "@hooks/useIsMobile";
export default function AuthTabs() {
    const [activeTab, setActiveTab] = useState("login");
    const keepLoggedIn = useLocalStorage("keepLoggedIn", "get");
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    useEffect(() => {
        if (keepLoggedIn) navigate("/app/social/streams");
    }, [keepLoggedIn, navigate]);

    // Filter icons for mobile - show fewer on mobile devices
    const getFilteredIcons = () => {
        const icons = [
            {
                icon: threeD[0],
                position: isMobile ? "top-[15%] left-[15%]" : "top-[12%] left-[12%]",
                animation: "animate-float-slow",
                size: isMobile ? "w-[120px] h-[120px]" : "w-[180px] h-[180px]",
            },
            {
                icon: threeD[1],
                position: isMobile ? "top-[10%] -right-[20%]" : "top-[8%] -right-[2%]",
                animation: "animate-float-medium",
                size: isMobile ? "w-[130px] h-[130px]" : "w-[190px] h-[190px]",
            },
            {
                icon: threeD[2],
                position: isMobile ? "bottom-[10%] left-[10%]" : "bottom-[15%] left-[8%]",
                animation: "animate-float-fast",
                size: isMobile ? "w-[140px] h-[140px]" : "w-[200px] h-[200px]",
            },
            {
                icon: threeD[3],
                position: isMobile ? "bottom-[8%] -right-[5%]" : "bottom-[12%] -right-[3%]",
                animation: "animate-float-slow",
                size: isMobile ? "w-[125px] h-[125px]" : "w-[185px] h-[185px]",
            },
        ];

        // Only add more icons on desktop for better performance
        if (!isMobile) {
            icons.push(
                {
                    icon: threeD[4],
                    position: "top-[28%] left-[28%]",
                    animation: "animate-float-medium",
                    size: "w-[195px] h-[195px]",
                },
                {
                    icon: threeD[5],
                    position: "-bottom-[5%] right-[12%]",
                    animation: "animate-float-fast",
                    size: "w-[205px] h-[205px]",
                },
                {
                    icon: threeD[6],
                    position: "top-[38%] right-[8%]",
                    animation: "animate-float-slow",
                    size: "w-[210px] h-[210px]",
                },
                {
                    icon: threeD[7],
                    position: "-bottom-[2%] left-[22%]",
                    animation: "animate-float-medium",
                    size: "w-[190px] h-[190px]",
                }
            );
        }
        
        return icons;
    };

    const socialIcons = getFilteredIcons();

    return (
        <div className="relative flex items-center justify-center min-h-[100svh] max-h-[100svh] w-full bg-primary-white overflow-y-scroll">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-lg"></div>
            </div>

            {/* Animated grid pattern overlay - using opacity-0 to remove this expensive rendering */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage:
                        "linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(to right, #4299e1 1px, transparent 1px)",
                    backgroundSize: isMobile ? "20px 20px" : "40px 40px",
                }}
            ></div>

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
                {/* Welcome header */}
                {activeTab === "login" && (
                    <div className="text-center mb-4 space-y-2">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-extrabold text-primary-black w-max flex items-center gap-2`}>
                                <div className={`${isMobile ? 'size-12' : 'size-16'}`}>
                                    <img
                                        src={assets.logo}
                                        alt="logo"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="text-[#1264AB]">BRAINET</span>
                            </span>
                        </div>
                    </div>
                )}

                {/* Auth form card */}
                <div className={`animate__animated animate__fadeInUpBig shadow-md bg-primary-white ${isMobile ? 'p-6' : 'p-8'} rounded-3xl transition-all duration-300 ease-linear hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm animate-fade-in`}>
                    <h2
                        className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center text-gray-800 ${
                            activeTab === "login" ? "" : "mb-6 "
                        }`}
                    >
                        {activeTab === "login" ? "" : "Create Account"}
                    </h2>

                    {activeTab === "register" ? (
                        <Register
                            onSwitchToLogin={() => setActiveTab("login")}
                            isMobile={isMobile}
                        />
                    ) : (
                        <Login
                            onSwitchToRegister={() => setActiveTab("register")}
                            isMobile={isMobile}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
