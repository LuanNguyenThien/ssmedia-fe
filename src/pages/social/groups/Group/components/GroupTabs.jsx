import PropTypes from "prop-types";
import { FaComments, FaUsers, FaImages, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

const GroupTabs = ({ activeTab, onTabChange, membershipStatus }) => {
    const tabs = [
        {
            id: "discussion",
            label: "Discussion",
            icon: <FaComments className="text-lg" />,
            showAlways: true,
        },
        {
            id: "members",
            label: "Members",
            icon: <FaUsers className="text-lg" />,
            showAlways: true,
        },
        {
            id: "media",
            label: "Media",
            icon: <FaImages className="text-lg" />,
            requiresMembership: true,
        },
        {
            id: "about",
            label: "About",
            icon: <FaInfoCircle className="text-lg" />,
            showAlways: true,
        },
    ];

    const visibleTabs = tabs.filter(tab => 
        tab.showAlways || 
        (tab.requiresMembership && (
            membershipStatus === "member" || 
            membershipStatus === "admin" || 
            membershipStatus === "moderator"
        ))
    );

    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-6">
                <div className="flex overflow-x-auto no-scrollbar">
                    {visibleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-4 font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

GroupTabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    membershipStatus: PropTypes.string.isRequired,
};

export default GroupTabs; 