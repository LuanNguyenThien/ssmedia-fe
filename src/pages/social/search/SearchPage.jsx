import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { postService } from "@services/api/post/post.service";
import "@pages/social/search/SearchPage.scss";
import SearchSidebar from "./components/SearchSidebar";
import SearchSkeleton from "./SearchSkeleton";
import SearchPosts from "./components/SearchPosts";
import { Utils } from "@/services/utils/utils.service";
import SearchImageTab from "./components/SearchImageMb";
import { icons } from "@/assets/assets";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";

const PAGE_SIZE = 5;

const SearchPage = () => {
    const isMobile = Utils.isMobileDevice();
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [isSearchWithImage, setIsSearchWithImage] = useState(false);

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
        console.log("Fetching search results with data:", searchData);
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
        const nextPage = page + 1;
        const start = (nextPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const nextChunk = allUsers.slice(start, end);

        if (nextChunk.length > 0) {
            setDisplayedUsers((prev) => [...prev, ...nextChunk]);
            setPage(nextPage);
        }
    };

    const hasMoreUsers = displayedUsers.length < allUsers.length;

    return (
        <div className="search-pagee col-span-full max-h-[84dvh] sm:max-h-full size-full overflow-y-scroll bg-background-blur rounded-t-[30px] px-2 pt-4 flex flex-col sm:flex-row gap-4">
            <SearchSidebar state={sidebarState} setState={setSidebarState} />{" "}
            {isMobile && (
                <div
                    onClick={() => {
                        setIsSearchWithImage(!isSearchWithImage);
                    }}
                    className={`w-full h-auto gap-2 bg-primary-white px-4 py-2 rounded-xl flex place-content-center `}
                >
                    {isSearchWithImage ? (
                        <div
                            className={`size-6 flex place-content-center ${
                                isSearchWithImage
                                    ? "text-red-500"
                                    : "text-primary-black"
                            }`}
                        >
                            <DynamicSVG
                                svgData={icons.remove}
                                className={"size-6"}
                            />
                        </div>
                    ) : (
                        <div className="size-6 flex place-content-center">
                            <img
                                src={icons.search_image}
                                alt=""
                                className="size-full object-cover"
                            />
                        </div>
                    )}

                    <span
                        className={`font-semibold text-sm flex items-center ${
                            isSearchWithImage
                                ? "text-red-500"
                                : "text-primary-black"
                        }`}
                    >
                        {isSearchWithImage
                            ? "Cancel"
                            : "Let's begin with an image!"}
                    </span>
                </div>
            )}
            {isMobile && isSearchWithImage && (
                <SearchImageTab setIsSearchWithImage={setIsSearchWithImage} />
            )}
            <div className="flex-1 flex w-full sm:w-2/3 lg:w-3/4 justify-center">
                <div className="w-full lg:w-2/3 h-full rounded-t-[30px] flex flex-col">
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
