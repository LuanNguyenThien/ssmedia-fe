import Posts from "@components/posts/Posts";
import PeopleCard from "./PeopleCard";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import useEffectOnce from "@hooks/useEffectOnce";
import { followerService } from "@/services/api/followers/follower.service";
import { Utils } from "@/services/utils/utils.service";
import { useDispatch } from "react-redux";

const PostCards = ({ posts, postsLoading, userFollowing }) => {
    return (
        <div className="rounded-md">
            <div className="flex flex-col">
                <Posts
                    allPosts={posts}
                    postsLoading={postsLoading}
                    userFollowing={userFollowing}
                />
                {/* {posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        showIcons={false}
                        className="search-page__posts"
                    />
                ))} */}
            </div>
        </div>
    );
};
const PeopleCards = ({ users, setRendered, handleShowMore, hasMoreUsers }) => {
    return (
        <>
            <div className=" rounded-[10px]  flex flex-col gap-2 bg-primary-white">
                <span className="text-xl font-bold px-4 pt-4">
                    Look Who We Found
                </span>
                <div className="flex flex-col gap-2 p-2">
                    {users &&
                        users.map((user) => (
                            <PeopleCard
                                setRendered={setRendered}
                                item={user}
                                key={user.id}
                            />
                        ))}
                </div>
                {hasMoreUsers && (
                    <div
                        onClick={handleShowMore}
                        className="text-primary-black hover:text-primary font-semibold text-sm mt-2 flex flex-col justify-center items-center cursor-pointer"
                    >
                        <span> Show More</span>
                        <IoIosArrowDown className="" />
                    </div>
                )}

                {users.length === 0 && (
                    <div className="flex items-center justify-center h-full pb-4">
                        <span className="text-gray-500">No users found</span>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-center items-center ">
                <div className="w-1/2 h-1 bg-primary-black/10 rounded-full"></div>
            </div>
        </>
    );
};

const SearchPosts = ({
    searchResults = [],
    state,
    handleShowMore,
    hasMoreUsers,
}) => {
    const dispatch = useDispatch();
    const [rendered, setRendered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState([]);

    const getUserFollowing = async () => {
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    useEffectOnce(() => {
        getUserFollowing();
    }, []);

    const renderContent = () => {
        switch (state) {
            case "Posts":
                return (
                    <PostCards
                        posts={searchResults?.posts}
                        postsLoading={loading}
                        userFollowing={following}
                    />
                );

            case "People":
                return (
                    <PeopleCards
                        handleShowMore={handleShowMore}
                        setRendered={setRendered}
                        users={searchResults?.users}
                        hasMoreUsers={hasMoreUsers}
                    />
                );
            default:
                return (
                    <>
                        {searchResults.users && (
                            <PeopleCards
                                hasMoreUsers={hasMoreUsers}
                                handleShowMore={handleShowMore}
                                users={searchResults?.users}
                            />
                        )}
                        {searchResults.posts && (
                            <PostCards
                                posts={searchResults?.posts}
                                postsLoading={loading}
                                userFollowing={following}
                            />
                        )}
                        {!searchResults?.users && !searchResults?.posts && (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-gray-500">
                                    No results found
                                </span>
                            </div>
                        )}
                    </>
                );
        }
    };
    return (
        <div className="size-full max-h-full overflow-y-scroll scroll-smooth flex flex-col gap-4 sm:px-4">
            {renderContent()}
        </div>
    );
};

export default SearchPosts;
