import Avatar from '@components/avatar/Avatar';
import '@components/posts/comments/comments-modal/CommentsModal.scss';
import ReactionWrapper from '@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper';
import useEffectOnce from '@hooks/useEffectOnce';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommentInputBox from '@components/posts/comments/comment-input/CommentInputBox';

const CommentsModal = () => {
  const { post } = useSelector((state) => state);
  const [postComments, setPostComments] = useState([]);
  const [openReplies, setOpenReplies] = useState({});
  const dispatch = useDispatch();

  const getPostComments = async () => {
    try {
      const response = await postService.getPostComments(post?._id);
      setPostComments(response.data?.comments);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleCommentAdded = async () => {
    await getPostComments();
  };

  useEffectOnce(() => {
    getPostComments();
  });

  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments
              .filter(comment => comment && comment.parentId === null)
              .map((data) => (
                <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
                  <div className="modal-comments-container-list-item-display">
                    <div className="user-img">
                      <Avatar
                        name={data?.username}
                        bgColor={data?.avatarColor}
                        textColor="#ffffff"
                        size={45}
                        avatarSrc={data?.profilePicture}
                      />
                    </div>
                    <div className="modal-comments-container-list-item-display-block">
                      <div className="comment-header">
                        <div className="comment-data">
                          <h1>{data?.username}</h1>
                          <p>{data?.comment}</p>
                          {data?.selectedImage && (
                            <div className="comment-image">
                              <img src={data.selectedImage} alt="Comment" className="comment-image-img" />
                            </div>
                          )}
                        </div>
                        <div className="more-options">
                          <button className="more-options-button">⋮</button>
                          <div className="more-options-menu">
                            <button className="edit-button">Edit</button>
                            <button className="delete-button">Delete</button>
                          </div>
                        </div>
                      </div>
                      <div className="comment-actions">
                        <button className="reaction-button">React</button>
                        <button className="reply-button" onClick={() => toggleReplies(data._id)}>
                          {openReplies[data._id] ? 'Hide Replies' : 'Reply'}
                        </button>
                      </div>
                      {openReplies[data._id] && (
                        <ul className="modal-comments-replies">
                          {postComments
                            .filter(reply => reply && reply.parentId === data._id)
                            .map(reply => (
                              <li className="modal-comments-container-list-item" key={reply._id} data-testid="modal-list-item">
                                <div className="modal-comments-container-list-item-display">
                                  <div className="user-img">
                                    <Avatar
                                      name={reply.username}
                                      bgColor={reply.avatarColor}
                                      textColor="#ffffff"
                                      size={45}
                                      avatarSrc={reply.profilePicture}
                                    />
                                  </div>
                                  <div className="modal-comments-container-list-item-display-block">
                                    <div className="comment-header">
                                      <div className="comment-data">
                                        <h1>{reply.username}</h1>
                                        <p>{reply.comment}</p>
                                        {reply.selectedImage && (
                                          <div className="comment-image">
                                            <img src={reply.selectedImage} alt="Comment" className="comment-image-img" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="more-options">
                                        <button className="more-options-button">⋮</button>
                                        <div className="more-options-menu">
                                          <button className="edit-button">Edit</button>
                                          <button className="delete-button">Delete</button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="comment-actions">
                                      <button className="reaction-button">React</button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                            <CommentInputBox post={post} parentId={data._id} onCommentAdded={handleCommentAdded} />
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};

export default CommentsModal;