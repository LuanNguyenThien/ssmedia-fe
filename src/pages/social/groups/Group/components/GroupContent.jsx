import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FaLock } from "react-icons/fa";
import { uniqBy } from "lodash";
import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { socketService } from "@services/socket/socket.service";
import { followerService } from "@services/api/followers/follower.service";
import Spinner from "@components/spinner/Spinner";

// Mock components for different tabs
const DiscussionTab = ({ group, canViewContent, onJoinGroup }) => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.user);
    const socket = socketService?.socket;
    
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalPostsCount, setTotalPostsCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    const appPosts = useRef([]);
    
    const PAGE_SIZE = 10;

    useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

    function fetchPostData() {
        if (loadingMore) {
            return;
        }
        console.log("fetching group posts");
        setLoadingMore(true);
        getAllGroupPosts().finally(() => setLoadingMore(false));
    }

    const getAllGroupPosts = async () => {
        try {
            // In real implementation, this would be a group-specific endpoint
            // For now, we'll use the general posts endpoint but filter for group
            const response = await postService.getAllPosts(currentPage);
            if (response.data.posts && response.data.posts.length > 0) {
                // Filter posts that belong to this group (in real app, this would be done server-side)
                const groupPosts = response.data.posts.filter(post => 
                    post.groupId === group.id || Math.random() > 0.5 // Mock filtering
                );
                
                appPosts.current = [...posts, ...groupPosts];
                const allPosts = uniqBy(appPosts.current, "_id");
                setPosts(allPosts);
                setCurrentPage((prevPage) => prevPage + 1);

                if (response.data.totalPosts) {
                    setTotalPostsCount(Math.floor(response.data.totalPosts / 2)); // Mock group posts count
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load group posts.",
                "error",
                dispatch
            );
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getUserFollowing = async () => {
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to load following.",
                "error",
                dispatch
            );
        }
    };

    useEffect(() => {
        if (canViewContent) {
            getUserFollowing();
            getAllGroupPosts();
        }
    }, [canViewContent, group.id]);

    useEffect(() => {
        const handleHidePost = ({ postId }) => {
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== postId)
            );
        };

        const handleUnhidePost = async ({ postId }) => {
            try {
                const response = await postService.getPost(postId);
                const newPost = response.data.post;

                setPosts((prevPosts) => {
                    const exists = prevPosts.find((p) => p._id === newPost._id);
                    if (exists) return prevPosts;
                    return [newPost, ...prevPosts];
                });
            } catch (error) {
                console.error("Failed to unhide post", error);
            }
        };

        socket?.on("hide post", handleHidePost);
        socket?.on("unhide post", handleUnhidePost);

        return () => {
            socket?.off("hide post", handleHidePost);
            socket?.off("unhide post", handleUnhidePost);
        };
    }, [socket]);

    useEffect(() => {
        PostUtils.socketIOPost(posts, setPosts, profile);
    }, [posts, profile]);

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Content for members only</h3>
                <p className="text-gray-600 mb-6">You need to join the group to see posts and discussions.</p>
                <button
                    onClick={onJoinGroup}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Join Group
                </button>
            </div>
        );
    }

    if (loading && posts.length === 0) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 mt-2 animate-skeleton-animation"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-skeleton-animation"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-skeleton-animation"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4" ref={bodyRef}>
            {/* Post Form - only show if user can post */}
            <PostForm groupId={group.id} />

            {/* Posts List */}
            <Posts
                allPosts={posts}
                postsLoading={loading}
                userFollowing={following}
                groupContext={group}
            />
            
            {/* End of posts message */}
            {currentPage > Math.ceil(totalPostsCount / PAGE_SIZE) && posts.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    You've seen all posts in this group.
                </div>
            )}

            {/* Empty state */}
            {!loading && posts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to share something in this group!</p>
                </div>
            )}

            {/* Loading more indicator */}
            <div
                ref={bottomLineRef}
                style={{ marginBottom: "20px", height: "20px" }}
            >
                {loadingMore && (
                    <div className="flex justify-center items-center">
                        <Spinner />
                    </div>
                )}
            </div>
        </div>
    );
};

const MembersTab = ({ group, canViewContent }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (canViewContent) {
            // Mock API call to fetch group members
            setTimeout(() => {
                setMembers([
                    { id: "1", name: "John Doe", role: "admin", avatar: null },
                    { id: "2", name: "Jane Smith", role: "moderator", avatar: null },
                    { id: "3", name: "David Wilson", role: "member", avatar: null },
                    { id: "4", name: "Sarah Johnson", role: "member", avatar: null },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [canViewContent]);

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Member list is protected</h3>
                <p className="text-gray-600">You need to join the group to see the member list.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Members ({group.memberCount.toLocaleString()})</h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                            <div className="flex-grow">
                                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                                <div className="h-3 bg-gray-200 rounded w-20 mt-2 animate-skeleton-animation"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Members ({group.memberCount.toLocaleString()})</h3>
            <div className="space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {member.avatar || member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">{member.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                        {member.role === "admin" && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Admin
                            </span>
                        )}
                        {member.role === "moderator" && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Moderator
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const MediaTab = ({ canViewContent }) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (canViewContent) {
            // Mock API call to fetch group media
            setTimeout(() => {
                setMedia([
                    { id: "1", url: "https://via.placeholder.com/300x300", type: "image" },
                    { id: "2", url: "https://via.placeholder.com/300x300", type: "image" },
                    { id: "3", url: "https://via.placeholder.com/300x300", type: "image" },
                    { id: "4", url: "https://via.placeholder.com/300x300", type: "image" },
                    { id: "5", url: "https://via.placeholder.com/300x300", type: "image" },
                    { id: "6", url: "https://via.placeholder.com/300x300", type: "image" },
                ]);
                setLoading(false);
            }, 800);
        }
    }, [canViewContent]);

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Media is protected</h3>
                <p className="text-gray-600">You need to join the group to see media.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Media</h3>
                <div className="grid grid-cols-3 gap-2">
                    {Array(6).fill().map((_, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-skeleton-animation"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Media</h3>
            {media.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {media.map((item) => (
                        <div key={item.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                            <img 
                                src={item.url} 
                                alt="Group media" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center py-8">No images have been shared yet.</p>
            )}
        </div>
    );
};

const AboutTab = ({ group }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">About {group.name}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-700">{group.description}</p>
                </div>
                
                <div>
                    <h4 className="font-medium text-gray-800 mb-2">General Information</h4>
                    <ul className="space-y-2 text-gray-700">
                        <li><span className="font-medium">Category:</span> {group.category}</li>
                        <li><span className="font-medium">Location:</span> {group.location}</li>
                        <li><span className="font-medium">Created:</span> {new Date(group.createdAt).toLocaleDateString()}</li>
                        <li><span className="font-medium">Group Type:</span> {
                            group.visibility === "public" ? "Public" :
                            group.visibility === "private" ? "Private" : "Secret"
                        }</li>
                    </ul>
                </div>
                
                {group.tags && group.tags.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {group.statistics && (
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Statistics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{group.statistics.totalPosts}</div>
                                <div className="text-sm text-gray-600">Total Posts</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{group.statistics.activeMembers}</div>
                                <div className="text-sm text-gray-600">Active Members</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const GroupContent = ({ group, activeTab, canViewContent, onJoinGroup }) => {
    // Render the appropriate tab content
    const renderContent = () => {
        switch (activeTab) {
            case "discussion":
                return <DiscussionTab group={group} canViewContent={canViewContent} onJoinGroup={onJoinGroup} />;
            case "members":
                return <MembersTab group={group} canViewContent={canViewContent} />;
            case "media":
                return <MediaTab canViewContent={canViewContent} />;
            case "about":
                return <AboutTab group={group} />;
            default:
                return <DiscussionTab group={group} canViewContent={canViewContent} onJoinGroup={onJoinGroup} />;
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

GroupContent.propTypes = {
    group: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
    canViewContent: PropTypes.bool.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
};

DiscussionTab.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
};

MembersTab.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
};

MediaTab.propTypes = {
    canViewContent: PropTypes.bool.isRequired,
};

AboutTab.propTypes = {
    group: PropTypes.object.isRequired,
};

export default GroupContent; 