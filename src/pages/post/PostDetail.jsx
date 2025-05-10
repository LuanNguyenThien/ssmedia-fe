import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import { CommentsList } from '@components/comments';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const response = await postService.getPost(postId);
        setPost(response.data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Error loading post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 ">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <img 
            src={post.profilePicture || `https://ui-avatars.com/api/?name=${post.username}&background=${post.avatarColor}&color=fff`} 
            alt={post.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-bold">{post.username}</h2>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <h1 className="text-xl font-bold mb-3">{post.post}</h1>
        
        {post.imgVersion && post.imgId && (
          <img 
            src={`https://res.cloudinary.com/your-cloud-name/image/upload/v${post.imgVersion}/${post.imgId}`} 
            alt="Post media" 
            className="w-full rounded-md mb-4"
          />
        )}
        
        {post.videoVersion && post.videoId && (
          <video 
            src={`https://res.cloudinary.com/your-cloud-name/video/upload/v${post.videoVersion}/${post.videoId}`}
            controls
            className="w-full rounded-md mb-4"
          />
        )}
        
        <div className="flex items-center gap-4 text-gray-500 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.reactions?.like || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>
      
      <CommentsList postId={postId} />
    </div>
  );
};

export default PostDetail; 