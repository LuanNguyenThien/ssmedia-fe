import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import GroupPosts from "./components/GroupPosts";
import { 
    FaPlus, 
    FaSearch, 
    FaUsers, 
    FaGlobe, 
    FaLock, 
    FaEnvelope,
    FaUserPlus,
    FaCheck,
    FaTimes,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

const GroupStream = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("joined");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [filterCategory, setFilterCategory] = useState("all");
    const [mobileView, setMobileView] = useState("posts"); // 'groups' or 'posts'
    const [isGroupsSidebarOpen, setIsGroupsSidebarOpen] = useState(false); // For mobile collapsible sidebar

    // Posts state (for the right side)
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [following] = useState([]);

    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const PAGE_SIZE = 10;

    useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

    // Posts functionality
    function fetchPostData() {
        if (loadingMore) {
            return;
        }
        setLoadingMore(true);
        getAllPosts().finally(() => setLoadingMore(false));
    }

    const getAllPosts = async () => {
        try {
            const response = await postService.getAllPosts(currentPage);
            if (response.data.posts && response.data.posts.length > 0) {
                const newPosts =
                    currentPage === 1
                        ? response.data.posts
                        : [...posts, ...response.data.posts];
                setPosts(newPosts);
                setCurrentPage((prevPage) => prevPage + 1);

                if (response.data.totalPosts) {
                    setTotalPostsCount(response.data.totalPosts);
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load posts.",
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    // Mock data for groups
    const [joinedGroups] = useState([
        {
            id: "1",
            name: "React Developers",
            description: "Community for React developers to share knowledge and experiences",
            memberCount: 15420,
            visibility: "public",
            category: "Technology",
            avatar: null,
            isAdmin: true,
            recentActivity: "2 hours ago",
            unreadPosts: 5
        },
        {
            id: "2", 
            name: "UI/UX Design Masters",
            description: "Advanced UI/UX design discussions and portfolio reviews",
            memberCount: 8932,
            visibility: "private",
            category: "Design",
            avatar: null,
            isAdmin: false,
            recentActivity: "1 day ago",
            unreadPosts: 0
        }
    ]);

    const [exploreGroups] = useState([
        {
            id: "3",
            name: "Machine Learning Hub",
            description: "Latest trends and discussions in ML and AI",
            memberCount: 25678,
            visibility: "public",
            category: "Technology",
            avatar: null,
            suggested: true
        },
        {
            id: "4",
            name: "Photography Enthusiasts",
            description: "Share your best shots and learn from professionals",
            memberCount: 12456,
            visibility: "public", 
            category: "Arts",
            avatar: null,
            suggested: false
        }
    ]);

    const [invitations] = useState([
        {
            id: "5",
            name: "Startup Founders Network",
            description: "Connect with fellow entrepreneurs and startup founders",
            memberCount: 5432,
            visibility: "private",
            category: "Business",
            avatar: null,
            invitedBy: "John Doe",
            invitedAt: "2 days ago"
        }
    ]);

    const tabs = [
        { 
            key: "joined", 
            label: "My Groups", 
            icon: FaUsers, 
            count: joinedGroups.length 
        },
        { 
            key: "explore", 
            label: "Explore", 
            icon: FaGlobe, 
            count: exploreGroups.length 
        },
        { 
            key: "invitations", 
            label: "Invitations", 
            icon: FaEnvelope, 
            count: invitations.length 
        }
    ];

    const categories = [
        "all", "Technology", "Design", "Business", "Arts", "Education", "Health", "Sports"
    ];

    const handleJoinGroup = (groupId) => {
        console.log("Joining group:", groupId);
        // API call to join group
    };

    const handleAcceptInvitation = (groupId) => {
        console.log("Accepting invitation:", groupId);
        // API call to accept invitation
    };

    const handleDeclineInvitation = (groupId) => {
        console.log("Declining invitation:", groupId);
        // API call to decline invitation
    };

    const renderGroupCard = (group, type) => {
        const getVisibilityIcon = () => {
            switch (group.visibility) {
                case "public":
                    return <FaGlobe className="text-blue-500" size={12} />;
                case "private":
                    return <FaLock className="text-gray-500" size={12} />;
                default:
                    return <FaGlobe className="text-blue-500" size={12} />;
            }
        };

        return (
            <div 
                key={group.id}
                className="bg-white rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/app/social/group/${group.id}`)}
            >
                <div className="p-3 md:p-3">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {group.avatar || group.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate text-sm md:text-sm">
                                    {group.name}
                                </h3>
                                <button 
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <HiDotsVertical size={14} />
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                {group.description}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    {getVisibilityIcon()}
                                    <span className="capitalize">{group.visibility}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaUsers size={10} />
                                    <span>{group.memberCount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Type-specific content */}
                            {type === "joined" && (
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-gray-500">
                                        {group.recentActivity}
                                        {group.unreadPosts > 0 && (
                                            <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full">
                                                {group.unreadPosts}
                                            </span>
                                        )}
                                    </div>
                                    {group.isAdmin && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            )}

                            {type === "explore" && (
                                <div className="flex items-center justify-between mt-2">
                                    {group.suggested && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            Suggested
                                        </span>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJoinGroup(group.id);
                                        }}
                                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                    >
                                        <FaUserPlus size={10} />
                                        Join
                                    </button>
                                </div>
                            )}

                            {type === "invitation" && (
                                <div className="mt-2">
                                    <div className="text-xs text-gray-500 mb-2">
                                        Invited by {group.invitedBy} • {group.invitedAt}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAcceptInvitation(group.id);
                                            }}
                                            className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                                        >
                                            <FaCheck size={10} />
                                            Accept
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeclineInvitation(group.id);
                                            }}
                                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600 flex items-center gap-1"
                                        >
                                            <FaTimes size={10} />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        let groups = [];
        let type = "";

        switch (activeTab) {
            case "joined":
                groups = joinedGroups;
                type = "joined";
                break;
            case "explore":
                groups = exploreGroups;
                type = "explore";
                break;
            case "invitations":
                groups = invitations;
                type = "invitation";
                break;
            default:
                groups = joinedGroups;
                type = "joined";
        }

        // Apply filters
        let filteredGroups = groups;

        if (searchTerm) {
            filteredGroups = groups.filter(group =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== "all") {
            filteredGroups = filteredGroups.filter(group => 
                group.category === filterCategory
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "name":
                filteredGroups.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "members":
                filteredGroups.sort((a, b) => b.memberCount - a.memberCount);
                break;
            case "recent":
            default:
                break;
        }

        if (filteredGroups.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaUsers className="text-gray-400" size={20} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        {activeTab === "joined" && "No groups joined yet"}
                        {activeTab === "explore" && "No groups found"}
                        {activeTab === "invitations" && "No pending invitations"}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                        {activeTab === "joined" && "Start by exploring groups"}
                        {activeTab === "explore" && "Try different filters"}
                        {activeTab === "invitations" && "Invitations will appear here"}
                    </p>
                    {activeTab !== "invitations" && (
                        <button 
                            onClick={() => activeTab === "joined" ? setActiveTab("explore") : navigate("/app/social/create-group")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs"
                        >
                            {activeTab === "joined" ? "Explore Groups" : "Create Group"}
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {filteredGroups.map(group => renderGroupCard(group, type))}
            </div>
        );
    };

    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-3 md:p-6 max-h-full overflow-y-auto">
            {/* Mobile View Toggle */}
            <div className="md:hidden mb-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setMobileView("posts")}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            mobileView === "posts"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600"
                        }`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setMobileView("groups")}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            mobileView === "groups"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600"
                        }`}
                    >
                        Groups
                    </button>
                </div>
            </div>

            <div className="md:grid md:grid-cols-10 md:gap-6 h-auto">
                {/* Left Sidebar - Groups (3 columns on desktop, full width on mobile when selected) */}
                <div className={`${
                    mobileView === "groups" ? "block" : "hidden"
                } md:block sm:!col-span-4 lg:!col-span-3 bg-white/80 rounded-2xl shadow-sm p-4 h-fit max-h-full overflow-y-scroll`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg md:text-lg font-extrabold text-gray-800">Groups</h2>
                            <button
                                onClick={() => navigate("/app/social/create-group")}
                                className="flex items-center gap-1 text-gray-400 text-xs p-1.5 rounded-full hover:underline transition-colors"
                                aria-label="Create new group"
                            >
                                <FaPlus />
                                <span className="hidden sm:inline">Create your own group</span>
                                <span className="sm:hidden">Create</span>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex md:flex-col max-w-[100vw] space-x-1 md:space-x-0 md:space-y-1 mb-4 overflow-x-scroll md:overflow-x-visible">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left whitespace-nowrap ${
                                        activeTab === tab.key
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <tab.icon size={16} />
                                    <span className="text-sm">{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full ml-auto">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Collapsible Filters Section for Mobile */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsGroupsSidebarOpen(!isGroupsSidebarOpen)}
                                className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
                            >
                                <span className="text-sm font-medium">Search & Filters</span>
                                {isGroupsSidebarOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className={`${isGroupsSidebarOpen ? "block" : "hidden"} md:block space-y-3 mb-4`}>
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 gap-3">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === "all" ? "All Categories" : category}
                                        </option>
                                    ))}
                                </select>
                                
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="recent">Recent Activity</option>
                                    <option value="name">Name</option>
                                    <option value="members">Most Members</option>
                                </select>
                            </div>
                        </div>

                        {/* Groups Content */}
                        <div className="flex-1 overflow-y-auto">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>

                {/* Right Side - Posts (7 columns on desktop, full width on mobile when selected) */}
                <div className={`${
                    mobileView === "posts" ? "block" : "hidden"
                } md:block sm:!col-span-6 lg:!col-span-7 w-full flex justify-center items-center lg:px-[10%]`}>
                    <GroupPosts
                        ref={bodyRef}
                        posts={posts}
                        loading={loading}
                        following={following}
                        currentPage={currentPage}
                        totalPostsCount={totalPostsCount}
                        pageSize={PAGE_SIZE}
                        loadingMore={loadingMore}
                        bottomLineRef={bottomLineRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default GroupStream;
