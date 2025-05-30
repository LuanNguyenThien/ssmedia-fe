import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import GroupSidebar from "./components/GroupSidebar";
import GroupPosts from "./components/GroupPosts";
import { useNavigate } from "react-router-dom";
import { groups } from "../mocks/mock.data";

const GroupStream = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
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

    const getFilteredGroups = () => {
        let filtered = groups;

        // Apply filter by join status
        if (activeFilter === "joined") {
            filtered = groups.filter(group => group.isJoined);
        } else if (activeFilter === "explore") {
            filtered = groups.filter(group => !group.isJoined);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(group =>
                group.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredGroups = getFilteredGroups();


    //get data for posts
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        // Reset search when changing filters for better UX
        if (filter !== activeFilter) {
            setSearchTerm("");
        }
    };

    const handleGroupToggle = (groupId) => {
        navigate(`/app/social/group/${groupId}`);
    };

    const handleCreateGroup = () => {
        navigate("/app/social/create-group");
    };

    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-6 max-h-full overflow-y-auto">
            <div className="grid grid-cols-10 gap-6 h-full">
                <GroupSidebar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredGroups={filteredGroups}
                    onGroupToggle={handleGroupToggle}
                    onCreateGroup={handleCreateGroup}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                />

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
    );
};

export default GroupStream;
