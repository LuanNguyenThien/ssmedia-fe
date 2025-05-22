import Input from "@components/input/Input";
import { icons } from "@assets/assets";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feelings from "@components/feelings/Feelings";
import { ImageUtils } from "@services/utils/image-utils.service";
import PropTypes from "prop-types";
import { toggleGifModal } from "@redux/reducers/modal/modal.reducer";
import useIsMobile from "@hooks/useIsMobile";

const ModalBoxSelection = ({ setSelectedPostImage, setSelectedVideo }) => {
    const isMobile = useIsMobile();
    const { feelingsIsOpen, gifModalIsOpen } = useSelector(
        (state) => state.modal
    );
    const { post } = useSelector((state) => state.post);
    const feelingsRef = useRef(null);
    const fileInputRef = useRef();
    const videoInputRef = useRef();
    const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(
        feelingsRef,
        feelingsIsOpen
    );
    const dispatch = useDispatch();

    const fileInputClicked = () => {
        fileInputRef.current.click();
    };

    const videoInputClicked = () => {
        videoInputRef.current.click();
    };

    const handleFileChange = (event) => {
        ImageUtils.addFileToRedux(
            event,
            post,
            setSelectedPostImage,
            dispatch,
            "image"
        );
    };

    const handleVideoFileChange = (event) => {
        ImageUtils.addFileToRedux(
            event,
            post,
            setSelectedVideo,
            dispatch,
            "video"
        );
    };

    return (
        <>
            {toggleFeelings && (
                <div ref={feelingsRef}>
                    <Feelings />
                </div>
            )}
            <div
                className="modal-box-selection bg-white rounded-lg shadow-sm border border-gray-100 mt-2"
                data-testid="modal-box-selection"
            >
                <ul
                    className="flex items-center justify-start px-2 py-1"
                    data-testid="list-item"
                >
                    <li
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={fileInputClicked}
                    >
                        <Input
                            name="image"
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = null;
                                }
                            }}
                            handleChange={handleFileChange}
                        />
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500">
                            <img
                                src={icons.picture}
                                alt=""
                                className="w-5 h-5"
                            />
                        </div>
                        {!isMobile && (
                            <span className="text-sm font-medium text-gray-700">
                                Photo
                            </span>
                        )}
                    </li>
                    <li
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                            dispatch(toggleGifModal(!gifModalIsOpen))
                        }
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-500">
                            <img src={icons.gif} alt="" className="w-5 h-5" />
                        </div>
                        {!isMobile && (
                            <span className="text-sm font-medium text-gray-700">
                                Gif
                            </span>
                        )}
                    </li>
                    <li
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setToggleFeelings(!toggleFeelings)}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 text-yellow-500">
                            <img
                                src={icons.feeling}
                                alt=""
                                className="w-5 h-5"
                            />
                        </div>
                        {!isMobile && (
                            <span className="text-sm font-medium text-gray-700">
                                Feeling
                            </span>
                        )}
                    </li>
                    <li
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={videoInputClicked}
                    >
                        <Input
                            name="video"
                            ref={videoInputRef}
                            type="file"
                            className="hidden"
                            onClick={() => {
                                if (videoInputRef.current) {
                                    videoInputRef.current.value = null;
                                }
                            }}
                            handleChange={handleVideoFileChange}
                        />
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500">
                            <img src={icons.video} alt="" className="w-5 h-5" />
                        </div>
                        {!isMobile && (
                            <span className="text-sm font-medium text-gray-700">
                                Video
                            </span>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
};
ModalBoxSelection.propTypes = {
    setSelectedPostImage: PropTypes.func,
    setSelectedVideo: PropTypes.func,
};
export default ModalBoxSelection;
