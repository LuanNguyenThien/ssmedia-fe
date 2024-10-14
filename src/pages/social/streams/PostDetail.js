import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import '@pages/social/streams/Streams.scss';

const PostDetail = () => {
  const { postId } = useParams();
  const { profile } = useSelector((state) => state.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef();
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(postId);
        console.log(response);
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
    <div className="streams" data-testid="post-detail">
      <div className="streams-content">
        <div className="streams-post">
          <Posts allPosts={post ? [post] : []} postsLoading={loading} userFollowing={profile?.following || []} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;