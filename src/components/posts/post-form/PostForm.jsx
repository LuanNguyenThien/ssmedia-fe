import Avatar from '@components/avatar/Avatar';
// import Input from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '@assets/assets';
import { Camera, SmilePlus } from "lucide-react";
import '@components/posts/post-form/PostForm.scss';
import {
  openModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleImageModal,
  toggleVideoModal
} from '@redux/reducers/modal/modal.reducer';
import ModalManager from "@components/posts/post-modal/post-add/PostTab";
import { useRef, useState } from 'react';
import { ImageUtils } from '@services/utils/image-utils.service';
import EditPost from '@components/posts/post-modal/post-edit/EditPost1';
import PostButtonItem from '../post-button-item/PostButtonItem';
import PostInputItem from '../post-input-item/PostInputItem';
import AddPost from "@components/posts/post-modal/post-add/AddPost";
import AddQuestion from "@components/posts/post-modal/post-add/AddQuestion";

const PostForm = () => {
  const { profile } = useSelector((state) => state.user);
  const {
    type,
    isOpen,
    openFileDialog,
    gifModalIsOpen,
    feelingsIsOpen,
    openVideoDialog,
    modalType,
  } = useSelector((state) => state.modal);
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
      {" "}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-4">
        <div
          className="flex gap-3 mb-4 cursor-pointer"
          onClick={() => openPostModal()}
        >
          <Avatar
            name={profile?.username}
            bgColor={profile?.avatarColor}
            textColor="#ffffff"
            size={50}
            avatarSrc={profile?.profilePicture}
          />
          <div className="flex-grow">
            <div className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-500">
              What&apos;s on your mind?
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-2">
          <div className="flex justify-start gap-6">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 text-gray-600 text-sm font-medium px-2 py-1 rounded"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                  dispatch(openModal({ type: "add" }));
                  dispatch(toggleImageModal(!openFileDialog));
                }}
              >
                <Camera className="w-5 h-5 text-blue-600" />
                <span>Image/Video</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </div>

            <button
              className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-yellow-100 px-2 py-1 rounded"
              onClick={openGifModal}
            >
              <span className="text-yellow-500 font-bold">GIF</span>
            </button>

            <button
              className="flex items-center gap-2 text-gray-600 text-sm font-medium"
              onClick={openFeelingsComponent}
            >
              <SmilePlus className="w-5 h-5 text-pink-500" />
              <span>Feeling</span>
            </button>
          </div>
        </div>
      </div>
      {/* <div className="post-form" data-testid="post-form">
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
      </div> */}
      {/* {isOpen && type === "add" && <ModalManager />} */}
      {isOpen && type === "add" && modalType === "createpost" && <AddPost />}
      {isOpen && type === "add" && modalType === "createquestion" && <AddQuestion />}
      {isOpen && type === "edit" && <EditPost />}
    </>
  );
};
export default PostForm;
