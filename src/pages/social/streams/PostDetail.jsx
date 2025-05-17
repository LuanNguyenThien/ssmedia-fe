import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import Post from '@/components/posts/post/Post';
import PostSkeleton from '@/components/posts/post/components/PostSkeleton/PostSkeleton';
import { PostUtils } from '@services/utils/post-utils.service';
import EditPost from '@components/posts/post-modal/post-edit/EditPost1';
import '@pages/social/saves/SavePage.scss';

const PostDetail = () => {
  const {
    type,
    isOpen,
  } = useSelector((state) => state.modal);
  const { postId } = useParams();
  const { profile } = useSelector((state) => state.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(postId);
        if (response.data && response.data.post) {
          setPost(response.data.post);
        } else {
          Utils.dispatchNotification('Post not found', 'error', dispatch);
        }
      } catch (error) {
        Utils.dispatchNotification(error.response?.data?.message || 'Error fetching post', 'error', dispatch);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, dispatch]);

  return (
    <>
      <div className="saves col-span-full size-full flex justify-center items-center pt-4" data-testid="post-detail">
        <div className="saves-content" style={{ height: '100%', width: '100%' }}>
          <div className="saves-post w-full" style={{ height: '85vh' }}>
            <div className="posts-container w-full" data-testid="posts">
              {!loading &&
                post && (
                  <div key={post?._id} data-testid="posts-item">
                    {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                      <>
                        {PostUtils.checkPrivacy(post, profile, profile?.following) && (
                          <>
                            <Post post={post} showIcons={false} />
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              {loading &&
                !post && (
                  [1].map((index) => (
                    <div key={index}>
                      <PostSkeleton />
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && type === "edit" && <EditPost />}
    </>
  );
};

export default PostDetail;
