import Post from "@/components/posts/post/Post";
import PeopleCard from "./PeopleCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostCards = ({ posts }) => {
    return (
        <div className="rounded-md">
            <div className="flex flex-col">
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        showIcons={false}
                        className="search-page__posts"
                    />
                ))}
            </div>
        </div>
    );
};
const PeopleCards = ({ users, setRendered }) => {
    return (
        <>
            <div className=" rounded-[10px]  flex flex-col gap-2 bg-primary-white p-6 ">
                <span className="text-xl font-extrabold">
                    Look Who We Found
                </span>
                <div className="flex flex-col gap-2">
                    {users &&
                        users.map((user) => (
                            <PeopleCard
                                setRendered={setRendered}
                                item={user}
                                key={user.id}
                            />
                        ))}
                </div>

                {users.length === 0 && (
                    <div className="flex items-center justify-center h-full">
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
    fetchSearchResults,
}) => {
    const [rendered, setRendered] = useState(false);

    const renderContent = () => {
        switch (state) {
            case "Posts":
                return <PostCards posts={searchResults?.posts} />;

            case "People":
                return (
                    <PeopleCards
                        setRendered={setRendered}
                        users={searchResults?.users}
                    />
                );
            default:
                return (
                    <>
                        {searchResults.users && (
                            <PeopleCards users={searchResults?.users} />
                        )}
                        {searchResults.posts && (
                            <PostCards posts={searchResults?.posts} />
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
    useEffect(() => {
        fetchSearchResults();
    }, [rendered]);

    return (
        <div className="size-full max-h-full overflow-y-scroll scroll-smooth flex flex-col gap-4 px-4">
            {renderContent()}
        </div>
    );
};

export default SearchPosts;
