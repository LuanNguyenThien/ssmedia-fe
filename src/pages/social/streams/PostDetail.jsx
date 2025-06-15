import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "@services/api/post/post.service";
import { Utils } from "@services/utils/utils.service";
import Post from "@/components/posts/post/Post";
import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import { PostUtils } from "@services/utils/post-utils.service";
import EditPost from "@components/posts/post-modal/post-edit/EditPost1";
import "@pages/social/saves/SavePage.scss";

const PostDetail = () => {
    const { type, isOpen } = useSelector((state) => state.modal);
    const { postId } = useParams();
    const { profile } = useSelector((state) => state.user);
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postService.getPost(postId);
                if (response.data && response.data.post) {
                    setPost(response.data.post);
                } else {
                    Utils.dispatchNotification(
                        "Post not found",
                        "error",
                        dispatch
                    );
                }
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error fetching post",
                    "error",
                    dispatch
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, dispatch]);

    useEffect(() => {
        PostUtils.socketIOPost(
            [post],
            (updatedPost) => {
                setPost(updatedPost[0]);
            },
            profile
        );
    }, [post]);

    console.log("post", post);
    return (
        <>
            <div
                className="savess py-6 bg-background-blur col-span-full sm:rounded-t-3xl size-full flex justify-center items-start max-h-[90dvh] overflow-scroll"
                data-testid="post-detail"
            >
                {!loading && post && (
                    <div key={post?._id} data-testid="posts-item">
                        {(!Utils.checkIfUserIsBlocked(
                            profile?.blockedBy,
                            post?.userId
                        ) ||
                            post?.userId === profile?._id) && (
                            <>
                                {PostUtils.checkPrivacy(
                                    post,
                                    profile,
                                    profile?.following
                                ) && (
                                    <>
                                        <Post post={post} showIcons={false} />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
                {loading &&
                    !post &&
                    [1].map((index) => (
                        <div key={index}>
                            <PostSkeleton />
                        </div>
                    ))}
            </div>

            {isOpen && type === "edit" && <EditPost />}
        </>
    );
};

export default PostDetail;
