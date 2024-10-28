import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { FaPaperPlane } from 'react-icons/fa';
import photo from '@assets/images/photo.png';
import feeling from '@assets/images/feeling.png';
import PropTypes from 'prop-types';
import '@components/posts/comments/comment-input/CommentInputBox.scss';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import { cloneDeep } from 'lodash';
import { socketService } from '@services/socket/socket.service';
import { postService } from '@services/api/post/post.service';
import ImagePreview from '@components/chat/image-preview/ImagePreview';
import { ImageUtils } from '@services/utils/image-utils.service';
import loadable from '@loadable/component';

const EmojiPickerComponent = loadable(() => import('@components/chat/window/message-input/EmojiPicker'), {
  fallback: <p id="loading">Loading...</p>
});

const CommentInputBox = ({ post, parentId = null, onCommentAdded }) => {
  const { profile } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [showEmojiContainer, setShowEmojiContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [file, setFile] = useState();
  const [base64File, setBase64File] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const fileInputRef = useRef();
  const commentInputRef = useRef(null);
  const dispatch = useDispatch();

  const addToPreview = async (file) => {
    let type;
    if (file.type.startsWith('image/')) {
        type = 'image';
    } else if (file.type.startsWith('video/')) {
        type = 'video';
    } else {
        window.alert(`File ${file.name} is not a valid image or video.`);
        return;
    }
    ImageUtils.checkFile(file, type);
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    setBase64File(result);
    setShowImagePreview(!showImagePreview);
    setShowEmojiContainer(false);
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const reset = () => {
    setBase64File('');
    setShowImagePreview(false);
    setShowEmojiContainer(false);
    setFile('');
  };

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      post = cloneDeep(post);
      post.commentsCount += 1;
      const commentBody = {
        userTo: post?.userId,
        postId: post?._id,
        comment: comment.trim(),
        selectedImage: base64File || '',
        commentsCount: post.commentsCount,
        profilePicture: profile?.profilePicture,
        parentId
      };
      socketService?.socket?.emit('comment', commentBody);
      await postService.addComment(commentBody);
      reset();
      setComment('');
      if (onCommentAdded) {
        onCommentAdded(); // Gọi callback khi bình luận được thêm
      }
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <>
      {showEmojiContainer && (
        <EmojiPickerComponent
          onEmojiClick={(event, eventObject) => {
            setComment((text) => (text += ` ${eventObject.emoji}`));
          }}
          pickerStyle={{ width: '352px', height: '447px' }}
        />
      )}
      <div className="comment-container" data-testid="comment-input">
        <div className="chat-inputarea" data-testid="chat-inputarea">
          {showImagePreview && (
            <ImagePreview
              image={file}
              onRemoveImage={() => {
                setFile('');
                setBase64File('');
                setShowImagePreview(!showImagePreview);
              }}
            />
          )}
          <form className="comment-form" onSubmit={submitComment}>
            <ul className="chat-list" style={{ borderColor: `${hasFocus ? '#50b5ff' : '#f1f0f0'}` }}>
              <li
                className="chat-list-item"
                onClick={() => {
                  fileInputClicked();
                  setShowEmojiContainer(false);
                }}
              >
                <Input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  className="file-input"
                  placeholder="Select file"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = null;
                    }
                  }}
                  handleChange={(event) => addToPreview(event.target.files[0])}
                />
                <img src={photo} alt="" />
              </li>
              <li
                className="chat-list-item"
                onClick={() => {
                  setShowEmojiContainer(!showEmojiContainer);
                  setShowImagePreview(false);
                }}
              >
                <img src={feeling} alt="" />
              </li>
            </ul>
            <Input
              ref={commentInputRef}
              name="comment"
              type="text"
              value={comment}
              labelText=""
              className="chat-input"
              placeholder="Write a comment..."
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              handleChange={(event) => setComment(event.target.value)}
            />
            <Button
                label={<FaPaperPlane />}
                className="paper"
                type="submit"
                disabled={!comment && !showImagePreview} // Vô hiệu hóa nút khi không có nội dung và không có hình ảnh xem trước
            />
          </form>
        </div>
      </div>
    </>
  );
};
CommentInputBox.propTypes = {
  post: PropTypes.object,
  parentId: PropTypes.string,
  onCommentAdded: PropTypes.func
};
export default CommentInputBox;
