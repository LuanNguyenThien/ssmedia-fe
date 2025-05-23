import PropTypes from "prop-types";
import { FaCog, FaImage, FaVideo, FaLink, FaPoll, FaCalendarAlt } from "react-icons/fa";

const ContentSettings = ({ contentSettings, onContentSettingChange }) => {
    const toggleSetting = (key) => {
        onContentSettingChange(key, !contentSettings[key]);
    };

    const contentOptions = [
        {
            key: "allowMemberPosts",
            label: "Member Posts",
            description: "Allow members to create posts",
            icon: FaCog,
        },
        {
            key: "allowEvents",
            label: "Events",
            description: "Allow members to create events",
            icon: FaCalendarAlt,
        },
        {
            key: "allowPhotos",
            label: "Photos",
            description: "Allow photo uploads in posts",
            icon: FaImage,
        },
        {
            key: "allowVideos",
            label: "Videos",
            description: "Allow video uploads in posts",
            icon: FaVideo,
        },
        {
            key: "allowLinks",
            label: "Links",
            description: "Allow sharing external links",
            icon: FaLink,
        },
        {
            key: "allowPolls",
            label: "Polls",
            description: "Allow members to create polls",
            icon: FaPoll,
        },
    ];

    const moderationOptions = [
        {
            key: "requirePostApproval",
            label: "Post Approval",
            description: "Require admin approval before posts are visible",
        },
        {
            key: "requireMemberApproval",
            label: "Member Approval",
            description: "Require admin approval for new members",
        },
        {
            key: "autoModeration",
            label: "Auto Moderation",
            description: "Automatically filter inappropriate content",
        },
    ];

    return (
        <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCog className="mr-2 text-blue-500" />
                Content Settings
            </h2>

            {/* Content Types */}
            <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Allowed Content Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <label
                                key={option.key}
                                className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={contentSettings[option.key]}
                                    onChange={() => toggleSetting(option.key)}
                                    className="sr-only"
                                />
                                <div className="flex items-center w-full">
                                    <IconComponent 
                                        className={`w-5 h-5 mr-3 ${
                                            contentSettings[option.key] ? "text-blue-500" : "text-gray-400"
                                        }`} 
                                    />
                                    <div className="flex-grow">
                                        <div className="font-medium text-gray-800">
                                            {option.label}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {option.description}
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <div
                                            className={`w-12 h-6 rounded-full transition-colors ${
                                                contentSettings[option.key] ? "bg-blue-500" : "bg-gray-300"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                                    contentSettings[option.key] ? "translate-x-6" : "translate-x-0.5"
                                                }`}
                                                style={{ marginTop: "2px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Moderation Settings */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Moderation Settings
                </h3>
                <div className="space-y-3">
                    {moderationOptions.map((option) => (
                        <label
                            key={option.key}
                            className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={contentSettings[option.key]}
                                onChange={() => toggleSetting(option.key)}
                                className="sr-only"
                            />
                            <div className="flex items-center w-full">
                                <div className="flex-grow">
                                    <div className="font-medium text-gray-800">
                                        {option.label}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {option.description}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <div
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            contentSettings[option.key] ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                                contentSettings[option.key] ? "translate-x-6" : "translate-x-0.5"
                                            }`}
                                            style={{ marginTop: "2px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </section>
    );
};

ContentSettings.propTypes = {
    contentSettings: PropTypes.object.isRequired,
    onContentSettingChange: PropTypes.func.isRequired,
};

export default ContentSettings; 