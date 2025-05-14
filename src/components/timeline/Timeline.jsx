import PostForm from "@components/posts/post-form/PostForm";
import PostFormSkeleton from "@components/posts/post-form/PostFormSkeleton";
import Post from "@/components/posts/post/Post";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import useEffectOnce from "@hooks/useEffectOnce";
import { followerService } from "@services/api/followers/follower.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "@components/timeline/Timeline.scss";
import useLocalStorage from "@hooks/useLocalStorage";
import { postService } from "@services/api/post/post.service";
import { addReactions } from "@redux/reducers/post/user-post-reaction.reducer";

const Timeline = ({ userProfileData, loading }) => {
    const { profile } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState();
    const [following, setFollowing] = useState([]);
    const [editableInputs, setEditableInputs] = useState({
        quote: "",
        work: "",
        school: "",
        location: "",
    });
    const [editableSocialInputs, setEditableSocialInputs] = useState({
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
    });
    const { username } = useParams();
    const dispatch = useDispatch();
    const storedUsername = useLocalStorage("username", "get");

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

    const getUserByUsername = useCallback(() => {
        if (userProfileData) {
            setPosts(userProfileData.posts);
            setUser(userProfileData.user);
            setEditableInputs({
                quote: userProfileData.user.quote,
                work: userProfileData.user.work,
                school: userProfileData.user.school,
                location: userProfileData.user.location,
            });
            setEditableSocialInputs(userProfileData.user?.social);
        }
    }, [userProfileData]);

    const getReactionsByUsername = async () => {
        try {
            const reactionsResponse = await postService.getReactionsByUsername(
                storedUsername
            );
            dispatch(addReactions(reactionsResponse.data.reactions));
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
        getReactionsByUsername();
    });

    useEffect(() => {
        if (username !== profile?.username) {
            const firstPost = document.querySelectorAll(".post-body")[0];
            if (firstPost) {
                firstPost.style.marginTop = "0";
            }
        }
    }, [username, profile]);

    useEffect(() => {
        getUserByUsername();
    }, [getUserByUsername]);

    useEffect(() => {
        PostUtils.socketIOPost(posts, setPosts, profile);
    }, [posts, profile]);

    return (
        <div>
            {loading && !posts.length && (
                <div className="timeline-wrapper-container-main">
                    <div style={{ marginBottom: "10px" }}>
                        <PostFormSkeleton />
                    </div>
                    <>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <div key={index}>
                                <PostSkeleton />
                            </div>
                        ))}
                    </>
                </div>
            )}

            {/* posts section */}
            {!loading && posts.length > 0 && (
                <div className="size-full flex flex-col gap-2 ">
                    {username === profile?.username && <PostForm />}
                    {posts.map((post) => (
                        <div key={post?._id}>
                            {(!Utils.checkIfUserIsBlocked(
                                profile?.blockedBy,
                                post?.userId
                            ) ||
                                post?.userId === profile?._id) && (
                                <>
                                    {PostUtils.checkPrivacy(
                                        post,
                                        profile,
                                        following
                                    ) && (
                                        <>
                                            <Post
                                                post={post}
                                                showIcons={
                                                    username ===
                                                    profile?.username
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!loading && posts.length === 0 && (
                <div className="timeline-wrapper-container-main">
                    <div className="empty-page" data-testid="empty-page">
                        No post available
                    </div>
                </div>
            )}
        </div>
    );
};

Timeline.propTypes = {
    userProfileData: PropTypes.object,
    loading: PropTypes.bool,
};
export default Timeline;
