import PropTypes from "prop-types";
import "@components/posts/Posts.scss";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Utils } from "@services/utils/utils.service";
import Post from "@/components/posts/post/Post";
import { PostUtils } from "@services/utils/post-utils.service";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
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
        <div
            className="posts-container flex flex-col gap-1 sm:gap-4 px-0 sm:px-0"
            data-testid="posts"
        >
            {!loading && posts.length > 0 && posts.map((post) => {
                const isBlocked = Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId);
                const isOwnPost = post?.userId === profile?._id;
                const meetsPrivacyRequirements = PostUtils.checkPrivacy(post, profile, following);
                
                if ((isBlocked && !isOwnPost) || !meetsPrivacyRequirements) {
                    return null;
                }

                return (
                    <div
                        key={post?._id}
                        data-testid="posts-item"
                    >
                        <Post post={post} showIcons={false} />
                    </div>
                );
            })}

            {loading && !posts.length && 
                Array.from({ length: 6 }, (_, index) => (
                    <PostSkeleton key={index} />
                ))
            }
        </div>
    );
};

Posts.propTypes = {
    allPosts: PropTypes.array.isRequired,
    userFollowing: PropTypes.array.isRequired,
    postsLoading: PropTypes.bool,
};

export default Posts;
