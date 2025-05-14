import React, { useState } from "react";
import PasswordSetting from "./components/PasswordSetting";
import PrivacySetting from "./components/PrivacySetting";
import NotificationSetting from "./components/NotificationSetting";
import AccountSetting from "./components/AccountSetting";
import { useSelector } from "react-redux";

const Setting = () => {
    const { profile } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState("account");
    const [userData, setUserData] = useState(() => ({
        uId: profile?.uId || "",    
        email: profile?.email || "",
        work: profile?.work || "",
        school: profile?.school || "",
        location: profile?.location || "",
        quote: profile?.quote || "",
        username: profile?.username || "",
        facebook: profile?.social?.facebook || "",
        instagram: profile?.social?.instagram || "",
        twitter: profile?.social?.twitter || "",
        youtube: profile?.social?.youtube || "",
    }));

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-gray-100 rounded-t-3xl h-[88vh] max-h-[88vh] py-4 px-4 col-span-full overflow-y-scroll ">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 border-r">
                        <nav className="p-4">
                            <ul>
                                <SidebarOption
                                    title="Account"
                                    active={activeTab === "account"}
                                    onClick={() => setActiveTab("account")}
                                />
                                <SidebarOption
                                    title="Password"
                                    active={activeTab === "password"}
                                    onClick={() => setActiveTab("password")}
                                />
                                <SidebarOption
                                    title="Personalization"
                                    active={activeTab === "personalization"}
                                    onClick={() =>
                                        setActiveTab("personalization")
                                    }
                                />
                                <SidebarOption
                                    title="Privacy"
                                    active={activeTab === "privacy"}
                                    onClick={() => setActiveTab("privacy")}
                                />
                                <SidebarOption
                                    title="Notification"
                                    active={activeTab === "notification"}
                                    onClick={() => setActiveTab("notification")}
                                />
                            </ul>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-3/4 p-6">
                        {activeTab === "account" && (
                            <div className="max-w-full">
                                <AccountSetting
                                    userData={userData}
                                    handleAccountChange={handleAccountChange}
                                />
                            </div>
                        )}
                        {activeTab === "password" && <PasswordSetting />}
                        {activeTab === "personalization" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">
                                    Personalization
                                </h2>
                                <p>Personalization settings coming soon.</p>
                            </div>
                        )}
                        {activeTab === "privacy" && <PrivacySetting />}
                        {activeTab === "notification" && (
                            <NotificationSetting />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarOption = ({ title, active, onClick }) => (
    <li
        className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-md cursor-pointer transition-colors ${
            active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
        }`}
        onClick={onClick}
    >
        <span className="font-medium">{title}</span>
    </li>
);

export default Setting;
