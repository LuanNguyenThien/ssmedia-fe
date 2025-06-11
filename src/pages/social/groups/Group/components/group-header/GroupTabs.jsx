import PropTypes from "prop-types";
import {
    FaComments,
    FaUsers,
    FaImages,
    FaInfoCircle,
    FaUserCheck,
} from "react-icons/fa";
import { useMemo } from "react";

const GroupTabs = ({
    activeTab,
    onTabChange,
    membershipStatus,
    pendingRequestsCount = 0,
}) => {
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
            id: "approvals-members",
            label: "Approvals Members",
            icon: <FaUserCheck className="text-lg" />,
            adminOnly: true,
            count: pendingRequestsCount,
        },
        {
            id: "approvals-posts",
            label: "Approvals Posts",
            icon: <FaImages className="text-lg" />,
            adminOnly: true,
        },
        {
            id: "about",
            label: "About",
            icon: <FaInfoCircle className="text-lg" />,
            showAlways: true,
        },
    ];

    const visibleTabs = useMemo(
        () =>
            tabs.filter(
                (tab) =>
                    tab.showAlways ||
                    (tab.requiresMembership &&
                        (membershipStatus === "member" ||
                            membershipStatus === "admin")) ||
                    (tab.adminOnly && membershipStatus === "admin")
            ),
        [membershipStatus]
    );

    return (
        <div className="border-b">
            <div className="container">
                <div className="flex overflow-x-auto no-scrollbar">
                    {visibleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-4 font-medium whitespace-nowrap transition-colors relative ${
                                activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600 font-bold transition-all duration-300"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {tab.label}
                            {/* {tab.count > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center font-bold">
                                    {tab.count}
                                </span>
                            )} */}
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
    pendingRequestsCount: PropTypes.number,
};

export default GroupTabs;
