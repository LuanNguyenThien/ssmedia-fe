import Input from '@components/input/Input';
import {icons} from '@assets/assets';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Feelings from '@components/feelings/Feelings';
import { ImageUtils } from '@services/utils/image-utils.service';
import PropTypes from 'prop-types';
import { toggleGifModal } from '@redux/reducers/modal/modal.reducer';

const ModalBoxSelection = ({ setSelectedPostImage, setSelectedVideo }) => {
  const { feelingsIsOpen, gifModalIsOpen } = useSelector((state) => state.modal);
  const { post } = useSelector((state) => state.post);
  const feelingsRef = useRef(null);
  const fileInputRef = useRef();
  const videoInputRef = useRef();
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(feelingsRef, feelingsIsOpen);
  const dispatch = useDispatch();

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const videoInputClicked = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    ImageUtils.addFileToRedux(event, post, setSelectedPostImage, dispatch, 'image');
  };

  const handleVideoFileChange = (event) => {
    ImageUtils.addFileToRedux(event, post, setSelectedVideo, dispatch, 'video');
  };

  return (
    <>
      {toggleFeelings && (
        <div ref={feelingsRef}>
          <Feelings />
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li className="post-form-list-item image-select" onClick={fileInputClicked}>
            <Input
              name="image"
              ref={fileInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = null;
                }
              }}
              handleChange={handleFileChange}
            />
            <img src={icons.picture} alt="" /> <span>Photo</span> 
          </li>
          <li className="post-form-list-item" onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}>
            <img src={icons.gif} alt="" /> <span>Gif</span> 
          </li>
          <li className="post-form-list-item" onClick={() => setToggleFeelings(!toggleFeelings)}>
            <img src={icons.feeling} alt="" /> <span>Feeling</span> 
          </li>
          <li className="post-form-list-item image-select" onClick={videoInputClicked}>
            <Input
              name="video"
              ref={videoInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                if (videoInputRef.current) {
                  videoInputRef.current.value = null;
                }
              }}
              handleChange={handleVideoFileChange}
            />
            <img src={icons.video} alt="" /> <span>Video</span> 
          </li>
        </ul>
      </div>
    </>
  );
};
ModalBoxSelection.propTypes = {
  setSelectedPostImage: PropTypes.func,
  setSelectedVideo: PropTypes.func
};
export default ModalBoxSelection;
