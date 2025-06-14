import PropTypes from "prop-types";
import "@components/posts/Posts.scss";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Utils } from "@services/utils/utils.service";
import Post from "@/components/posts/post/PostGroup";
import { PostUtils } from "@services/utils/post-utils.service";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";

const Posts = ({
    allPosts,
    userFollowing,
    postsLoading,
    groupContext,
    type,
}) => {
    const { profile } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPosts(allPosts);
        setFollowing(userFollowing);
        setLoading(postsLoading);
    }, [allPosts, userFollowing, postsLoading]);

    return (
        <div className="w-full max-w-full px-0 sm:px-0 mt-2 sm:mt-0">
            <div
                className="posts-container flex flex-col gap-1 sm:gap-4 px-0 sm:px-0"
                data-testid="posts"
            >
                {!loading &&
                    posts.length > 0 &&
                    posts.map((post) => {
                        const isBlocked = Utils.checkIfUserIsBlocked(
                            profile?.blockedBy,
                            post?.userId
                        );
                        const isOwnPost = post?.userId === profile?._id;
                        // const meetsPrivacyRequirements = PostUtils.checkPrivacy(
                        //     post,
                        //     profile,
                        //     following
                        // );
                        const isPending =
                            post?.status === "pending" && type === "discussion";
                        if (
                            (isBlocked && !isOwnPost) ||
                            // !meetsPrivacyRequirements ||
                            isPending
                        ) {
                            return null;
                        }
                        console.log(post);

                        return (
                            <div
                                key={post?._id}
                                className="w-full transition-all duration-300 hover:shadow-lg"
                                data-testid="posts-item"
                            >
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-50">
                                    <Post
                                        post={post}
                                        showIcons={false}
                                        groupContext={groupContext}
                                    />
                                </div>
                            </div>
                        );
                    })}

                {loading && !posts.length && (
                    <div className="flex flex-col gap-1 sm:gap-4">
                        {Array.from({ length: 6 }, (_, index) => (
                            <div
                                key={index}
                                className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-50"
                            >
                                <PostSkeleton />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

Posts.propTypes = {
    allPosts: PropTypes.array.isRequired,
    userFollowing: PropTypes.array.isRequired,
    postsLoading: PropTypes.bool,
    groupContext: PropTypes.object,
};

export default Posts;
