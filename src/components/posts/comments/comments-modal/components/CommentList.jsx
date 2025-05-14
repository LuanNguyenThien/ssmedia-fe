import PropTypes from "prop-types";
import CommentItem from "./CommentItem";
import CommentInputBox from "@components/posts/comments/comment-input/CommentInputBox";
import { useState } from "react";

const CommentList = ({ 
  comments, 
  openReplies, 
  toggleReplies, 
  post, 
  onCommentAdded 
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Filter top-level comments (those without a parent)
  const topLevelComments = comments.filter(
    (comment) => comment && comment.parentId === null
  );

  const handleReply = (comment) => {
    setReplyingTo(comment._id);
    toggleReplies(comment._id);
  };

  const handleCommentUpdated = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  return (
    <ul className="space-y-6">
      {topLevelComments.map((comment) => (
        <div key={comment._id}>
          <CommentItem 
            comment={comment} 
            onToggleReplies={toggleReplies}
            showReplies={openReplies[comment._id]}
            onReply={handleReply}
            isReply={false}
            onCommentUpdated={handleCommentUpdated}
            postId={post?._id}
          />
          
          {/* Render replies if open */}
          {openReplies[comment._id] && (
            <div className="ml-12 mt-1 space-y-1">
              {/* Filter and map replies */}
              {comments
                .filter(
                  (reply) => reply && reply.parentId === comment._id
                )
                .map((reply) => (
                  <CommentItem 
                    key={reply._id} 
                    comment={reply}
                    isReply={true}
                    onCommentUpdated={handleCommentUpdated}
                    postId={post?._id}
                  />
                ))}
              
              {/* Reply input */}
              <div className="mt-4">
                <CommentInputBox
                  post={post}
                  parentId={comment._id}
                  onCommentAdded={() => {
                    onCommentAdded();
                    setReplyingTo(null);
                  }}
                  placeholder={`Reply to ${comment.username}...`}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </ul>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  openReplies: PropTypes.object.isRequired,
  toggleReplies: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  onCommentAdded: PropTypes.func.isRequired
};

export default CommentList; 