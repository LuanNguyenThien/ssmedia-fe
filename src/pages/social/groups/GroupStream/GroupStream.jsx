import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Utils } from "@services/utils/utils.service";
import {
    FaPlus,
    FaUsers,
    FaGlobe,
    FaEnvelope,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { groupService } from "@services/api/group/group.service";
import { groupCategories } from "../group.constants";
import { NotificationUtils } from "@/services/utils/notification-utils.service";

// Import new components
import {
    GroupTabs,
    GroupFilters,
    GroupTabContent,
    GroupStreamContent,
} from "./components";

const GroupStream = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);
    const userId = profile?._id;

    const [activeTab, setActiveTab] = useState("joined");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [isGroupsSidebarOpen, setIsGroupsSidebarOpen] = useState(false); // For mobile collapsible sidebar

    const [joinedGroups, setJoinedGroups] = useState([]);
    const [invitations, setinvitations] = useState([]);
    const [exploreGroups, setExploreGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGroups = async () => {
        try {
            setLoading(true);

            const [groups, groupInvitations, exploreGroups] = await Promise.all(
                [
                    groupService.getGroupByUserId(userId),
                    groupService.getGroupByinvitations(),
                    groupService.getGroupNotJoinByGroupId(),
                ]
            );

            setExploreGroups(exploreGroups.data.groups || []);
            setinvitations(groupInvitations.data.groups || []);
            setJoinedGroups(groups.data.groups);
        } catch (err) {
            NotificationUtils.dispatchNotification(
                err.response?.data?.message || "Failed to fetch groups",
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchGroups();
        }
    }, [userId]);

    const tabs = [
        {
            key: "joined",
            label: "My Groups",
            icon: FaUsers,
            count: joinedGroups.length,
        },
        {
            key: "explore",
            label: "Explore",
            icon: FaGlobe,
            count: exploreGroups.length,
        },
        {
            key: "invitations",
            label: "Invitations",
            icon: FaEnvelope,
            count: invitations.length,
        },
    ];

    const categories = ["all", ...groupCategories];

    const handleJoinGroup = async (groupId) => {
        try {
            const response = await groupService.joinGroup(groupId);
            Utils.dispatchNotification(
                response.data?.message || "Successfully joined the group",
                "success",
                dispatch
            );
            // Refresh groups after joining
            fetchGroups();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to join group",
                "error",
                dispatch
            );
        }
    };

    const handleAcceptInvitation = async (groupId) => {
        try {
            const response = await groupService.acceptGroupInvitation(groupId);
            Utils.dispatchNotification(
                response.data?.message ||
                    "Group invitation accepted successfully",
                "success",
                dispatch
            );
            // Refresh groups after accepting invitation
            fetchGroups();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message ||
                    "Failed to accept group invitation",
                "error",
                dispatch
            );
        }
    };

    const handleDeclineInvitation = async (groupId) => {
        try {
            const response = await groupService.declineGroupInvitation(groupId);
            Utils.dispatchNotification(
                response.data?.message ||
                    "Group invitation declined successfully",
                "success",
                dispatch
            );
            // Refresh groups after declining invitation
            fetchGroups();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message ||
                    "Failed to decline group invitation",
                "error",
                dispatch
            );
        }
    };

    const getCurrentGroups = () => {
        switch (activeTab) {
            case "joined":
                return joinedGroups;
            case "explore":
                return exploreGroups;
            case "invitations":
                return invitations;
            default:
                return joinedGroups;
        }
    };

    if (loading) {
        return (
            <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl">
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                        <p className="text-gray-600 text-sm">
                            Loading groups...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl max-h-screen overflow-y-auto">
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            Groups
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Connect with communities that share your interests
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/app/social/create-group")}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm font-medium"
                    >
                        <FaPlus size={12} />
                        <span className="hidden sm:inline">Create Group</span>
                    </button>
                </div>

                {/* Mobile Toggle for Groups Sidebar */}
                <div className="lg:hidden mb-4 ">
                    <button
                        onClick={() =>
                            setIsGroupsSidebarOpen(!isGroupsSidebarOpen)
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between text-sm font-medium"
                    >
                        <span>Browse Groups</span>
                        {isGroupsSidebarOpen ? (
                            <FaChevronUp size={14} />
                        ) : (
                            <FaChevronDown size={14} />
                        )}
                    </button>
                </div>

                <div className="justify-between items-start grid grid-cols-12 gap-4">
                    {/* Groups Sidebar */}
                    <div
                        className={`col-span-full sm:col-span-6 lg:col-span-4 ${
                            isGroupsSidebarOpen ? "block" : "hidden lg:block"
                        }`}
                    >
                        <div className="bg-white w-full rounded-md p-4">
                            <GroupTabs
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />

                            <GroupFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                filterCategory={filterCategory}
                                onCategoryChange={setFilterCategory}
                                categories={categories}
                            />

                            <GroupTabContent
                                activeTab={activeTab}
                                groups={getCurrentGroups()}
                                searchTerm={searchTerm}
                                filterCategory={filterCategory}
                                userId={userId}
                                onJoinGroup={handleJoinGroup}
                                onAcceptInvitation={handleAcceptInvitation}
                                onDeclineInvitation={handleDeclineInvitation}
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-full lg:col-span-8 ">
                        <GroupStreamContent
                            exploreGroups={exploreGroups.slice(0, 12)}
                            joinedGroups={joinedGroups}
                            onJoinGroup={handleJoinGroup}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupStream;
