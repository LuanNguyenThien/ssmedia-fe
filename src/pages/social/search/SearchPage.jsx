import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { postService } from "@services/api/post/post.service";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import Post from "@components/posts/post/Post";
import { Spinner } from "@chakra-ui/react"; // Dùng spinner từ Chakra UI
import "@pages/social/search/SearchPage.scss";
import SearchSidebar from "./components/SearchSidebar";
import SearchSkeleton from "./SearchSkeleton";
import SearchPosts from "./components/SearchPosts";

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const bodyRef = useRef(null);
    const bottomLineRef = useRef();
    useInfiniteScroll(bodyRef, bottomLineRef, fetchSearchResults);
    const location = useLocation();
    const searchQuery = location.state?.query || "";
    const [sidebarState, setSidebarState] = useState("All");

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    async function fetchSearchResults() {
        console.log("Fetching search results for:", searchQuery);
        setLoading(true);
        try {
            const response = await postService.searchPosts(searchQuery);
            setSearchResults(response.data.result);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="search-pagee max-h-full size-full bg-background-blur rounded-t-[30px] px-4 pt-4 flex gap-4 "
            ref={bodyRef}
        >
            {/* sidebar */}
            <SearchSidebar state={sidebarState} setState={setSidebarState} />

            {/* posts */}
            <div className="flex-1 flex justify-center">
                <div className="w-2/3 h-full rounded-t-[30px] flex flex-col">
                    {loading && searchResults.length === 0 && (
                        <SearchSkeleton />
                    )}
                    {/* 
            {!loading && searchResults.length === 0 && (
                <div className="search-page__no-results">
                    <p>Không tìm thấy kết quả nào</p>
                </div>
            )} */}
                    {!loading && searchResults.length !== 0 && (
                        <SearchPosts
                            state={sidebarState}
                            searchResults={searchResults}
                            fetchSearchResults={fetchSearchResults}
                        />
                    )}

                    <div
                        ref={bottomLineRef}
                        className="search-page__bottom-line"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
