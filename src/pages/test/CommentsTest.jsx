import React from 'react';
import { CommentsSection } from '@components/comments';

const CommentsTest = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Comments Functionality Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Sample Post</h2>
        <p className="mb-4">
          This is a sample post to test the comments functionality. Below you will find the 
          comments section with upvote/downvote reactions.
        </p>
        <p className="text-sm text-gray-500">
          Posted by: testuser - {new Date().toLocaleDateString()}
        </p>
      </div>
      
      <CommentsSection postId="test-post-123" />
    </div>
  );
};

export default CommentsTest; 