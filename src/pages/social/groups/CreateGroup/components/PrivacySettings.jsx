import PropTypes from "prop-types";
import { FaGlobe, FaLock, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

const PrivacySettings = ({ 
    visibility, 
    privacy, 
    onVisibilityChange, 
    onPrivacyChange 
}) => {
    const visibilityOptions = [
        {
            value: "public",
            label: "Public",
            description: "Anyone can see the group and its members",
            icon: FaGlobe,
        },
        {
            value: "private",
            label: "Private",
            description: "Only members can see posts and member list",
            icon: FaLock,
        },
        {
            value: "secret",
            label: "Secret",
            description: "Only members can find and see this group",
            icon: FaEyeSlash,
        },
    ];

    const joinOptions = [
        { value: "anyone", label: "Anyone can join" },
        { value: "admin_approval", label: "Admin approval required" },
        { value: "invite_only", label: "Invite only" },
    ];

    const postOptions = [
        { value: "members", label: "All members" },
        { value: "admins_only", label: "Admins only" },
    ];

    const visibilityViewOptions = [
        { value: "everyone", label: "Everyone" },
        { value: "members", label: "Members only" },
        { value: "admins_only", label: "Admins only" },
    ];

    return (
        <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-blue-500" />
                Privacy & Visibility
            </h2>

            {/* Group Visibility */}
            <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Group Visibility
                </h3>
                <div className="space-y-3">
                    {visibilityOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <label
                                key={option.value}
                                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                                    visibility === option.value
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={option.value}
                                    checked={visibility === option.value}
                                    onChange={(e) => onVisibilityChange(e.target.value)}
                                    className="sr-only"
                                />
                                <IconComponent 
                                    className={`w-5 h-5 mt-0.5 mr-3 ${
                                        visibility === option.value ? "text-blue-500" : "text-gray-400"
                                    }`} 
                                />
                                <div>
                                    <div className="font-medium text-gray-800">
                                        {option.label}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {option.description}
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Privacy Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who can join this group?
                    </label>
                    <select
                        value={privacy.whoCanJoin}
                        onChange={(e) => onPrivacyChange("whoCanJoin", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {joinOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who can post in this group?
                    </label>
                    <select
                        value={privacy.whoCanPost}
                        onChange={(e) => onPrivacyChange("whoCanPost", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {postOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who can see members?
                    </label>
                    <select
                        value={privacy.whoCanSeeMembers}
                        onChange={(e) => onPrivacyChange("whoCanSeeMembers", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {visibilityViewOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who can see posts?
                    </label>
                    <select
                        value={privacy.whoCanSeePosts}
                        onChange={(e) => onPrivacyChange("whoCanSeePosts", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {visibilityViewOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

PrivacySettings.propTypes = {
    visibility: PropTypes.string.isRequired,
    privacy: PropTypes.object.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    onPrivacyChange: PropTypes.func.isRequired,
};

export default PrivacySettings; 