import PropTypes from "prop-types";
import { forwardRef } from "react";
import Posts from "@components/posts/Posts";
import Spinner from "@components/spinner/Spinner";

const GroupPosts = forwardRef(({ 
    posts, 
    loading, 
    following, 
    currentPage, 
    totalPostsCount, 
    pageSize, 
    loadingMore,
    bottomLineRef 
}, bodyRef) => {
    return (
        <div className="rounded-2xl shadow-sm h-full w-full overflow-hidden flex justify-center items-center">
            <div className="h-full overflow-y-scroll w-full lg:w-full" ref={bodyRef}>
                {/* Posts */}
                <Posts
                    allPosts={posts}
                    postsLoading={loading}
                    userFollowing={following}
                />

                {/* End of posts indicator */}
                <div>
                    {currentPage > Math.ceil(totalPostsCount / pageSize) && (
                        <div className="text-center text-gray-500 py-4">
                            You have read all group posts.
                        </div>
                    )}
                </div>

                {/* Infinite scroll loader */}
                <div
                    ref={bottomLineRef}
                    style={{ marginBottom: "20px", height: "20px" }}
                >
                    {loadingMore && (
                        <div className="flex justify-center items-center py-4">
                            <Spinner />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

GroupPosts.displayName = "GroupPosts";

GroupPosts.propTypes = {
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    following: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPostsCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    loadingMore: PropTypes.bool.isRequired,
    bottomLineRef: PropTypes.object.isRequired,
};

export default GroupPosts; 