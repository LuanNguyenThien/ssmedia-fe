import Avatar from '@components/avatar/Avatar';
// import Input from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '@assets/assets';

import '@components/posts/post-form/PostForm.scss';
import {
  openModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleImageModal,
  toggleVideoModal
} from '@redux/reducers/modal/modal.reducer';
import AddPost from '@components/posts/post-modal/post-add/AddPost';
import { useRef, useState } from 'react';
import { ImageUtils } from '@services/utils/image-utils.service';
import EditPost from '@components/posts/post-modal/post-edit/EditPost';
import PostButtonItem from '../post-button-item/PostButtonItem';
import PostInputItem from '../post-input-item/PostInputItem';

const PostForm = () => {
  const { profile } = useSelector((state) => state.user);
  const { type, isOpen, openFileDialog, gifModalIsOpen, feelingsIsOpen, openVideoDialog } = useSelector(
    (state) => state.modal
  );
  const [selectedPostImage, setSelectedPostImage] = useState();
  const [selectedPostVideo, setSelectedPostVideo] = useState();
  const fileInputRef = useRef();
  const videoInputRef = useRef();
  const dispatch = useDispatch();

  const openFileVideoInput = () => {
    openVideoModal();
    if (videoInputRef.current) {
      videoInputRef.current.value = null;
    }
  };
  const openFilePictureInput = () => {
    openImageModal();
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const openPostModal = () => {
    dispatch(openModal({ type: 'add' }));
  };

  const openImageModal = () => {
    fileInputRef.current.click();
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleImageModal(!openFileDialog));
  };

  const openVideoModal = () => {
    videoInputRef.current.click();
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleVideoModal(!openVideoDialog));
  };

  const openGifModal = () => {
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleGifModal(!gifModalIsOpen));
  };

  const openFeelingsComponent = () => {
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };

  const handleFileChange = (event) => {
    ImageUtils.addFileToRedux(event, '', setSelectedPostImage, dispatch, 'image');
  };

  const handleVideoFileChange = (event) => {
    ImageUtils.addFileToRedux(event, '', setSelectedPostVideo, dispatch, 'video');
  };

  return (
    <>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div className="post-form-input-body" data-testid="input-body" onClick={() => openPostModal()}>
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div className="post-form-input" data-placeholder="Write something here..."></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
              <PostInputItem
                text={'Photo'}
                icon={icons.picture}
                onClick={openFilePictureInput}
                type={'file'}
                handleChange={handleFileChange}
                ref={fileInputRef}
              />{' '}
              <PostInputItem
                text={'Video'}
                icon={icons.video}
                onClick={openFileVideoInput}
                type={'file'}
                handleChange={handleVideoFileChange}
                ref={videoInputRef}
              />
              <PostButtonItem text={'Gif'} icon={icons.gif} onClick={openGifModal} />
              <PostButtonItem text={'Feeling'} icon={icons.feeling} onClick={openFeelingsComponent} />
            </ul>
          </div>
        </div>
      </div>
      {isOpen && type === 'add' && <AddPost selectedImage={selectedPostImage} selectedPostVideo={selectedPostVideo} />}
      {isOpen && type === 'edit' && <EditPost />}
    </>
  );
};
export default PostForm;
