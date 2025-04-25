import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { postService } from "@services/api/post/post.service";
import "@pages/social/search/SearchPage.scss";
import SearchSidebar from "./components/SearchSidebar";
import SearchSkeleton from "./SearchSkeleton";
import SearchPosts from "./components/SearchPosts";

const PAGE_SIZE = 5;

const SearchPage = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const location = useLocation();
    const searchQuery = location.state?.query || "";
    const searchImage = location.state?.image || null;
    const hasImage = location.state?.hasImage || false;
    const searchData = {
        query: searchQuery,
        image: searchImage,
        hasImage: hasImage,
    };
    const [sidebarState, setSidebarState] = useState("All");

    useEffect(() => {
        resetState();
        fetchSearchResults();
    }, [searchQuery, searchImage, hasImage]);

    const resetState = () => {
        setAllUsers([]);
        setDisplayedUsers([]);
        setAllPosts([]);
        setPage(1);
    };

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const response = await postService.searchWithImage(searchData);
            const { users, posts } = response.data.result;

            setAllUsers(users);
            setDisplayedUsers(users.slice(0, PAGE_SIZE));
            setAllPosts(posts);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreUsers = () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        const start = (nextPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const nextChunk = allUsers.slice(start, end);

        if (nextChunk.length > 0) {
            setDisplayedUsers((prev) => [...prev, ...nextChunk]);
            setPage(nextPage);
        }

        setLoadingMore(false);
    };

    const hasMoreUsers = displayedUsers.length < allUsers.length;

    return (
        <div className="search-pagee max-h-full size-full bg-background-blur rounded-t-[30px] px-4 pt-4 flex gap-4">
            <SearchSidebar state={sidebarState} setState={setSidebarState} />

            <div className="flex-1 flex w-3/4 justify-center">
                <div className="w-2/3 h-full rounded-t-[30px] flex flex-col">
                    {loading && displayedUsers.length === 0 && (
                        <SearchSkeleton />
                    )}

                    {!loading && (
                        <SearchPosts
                            state={sidebarState}
                            searchResults={{
                                users: displayedUsers,
                                posts: allPosts,
                            }}
                            handleShowMore={loadMoreUsers}
                            hasMoreUsers={hasMoreUsers}

                        />
                    )}                
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
