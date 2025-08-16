import Input from "@components/input/Input";
import { icons } from "@assets/assets";
// import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feelings from "@components/feelings/Feelings";
import { ImageUtils } from "@services/utils/image-utils.service";
import PropTypes from "prop-types";
import { toggleGifModal } from "@redux/reducers/modal/modal.reducer";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
// import loadable from "@loadable/component";

// const EmojiPickerComponent = loadable(
//     () => import("@components/posts/comments/comment-input/EmojiPicker"),
//     {
//         fallback: <p id="loading">Loading...</p>,
//     }
// );

const ModalBoxSelection = ({ setSelectedPostImage, setSelectedVideo }) => {
    const { gifModalIsOpen } = useSelector((state) => state.modal);
    const { post } = useSelector((state) => state.post);
    // const feelingsRef = useRef(null);
    const fileInputRef = useRef();
    const videoInputRef = useRef();
    // const emojiRef = useRef(null);
    // const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(
    //     feelingsRef,
    //     feelingsIsOpen
    // );
    // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

    // const handleEmojiClick = (emoji) => {
    //     // Get the editable element (content area)
    //     onEmojiSelect(emoji);

    //     setShowEmojiPicker(false);
    // };

    return (
        <>
            {/* {toggleFeelings && (
                <div ref={feelingsRef} className="absolute bottom-full left-0 mb-2 z-[20]">
                    <Feelings />
                </div>
            )} */}

            <div
                className="modal-box-selection rounded-lg relative"
                data-testid="modal-box-selection"
            >
                {/* {showEmojiPicker && (
                    <div
                        ref={emojiRef}
                        className="absolute bottom-full left-0 mb-2 z-[20]"
                    >
                        <EmojiPickerComponent
                            onEmojiClick={handleEmojiClick}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </div>
                )} */}
                <ul
                    className="flex items-center justify-start gap-2 px-2 py-1"
                    data-testid="list-item"
                >
                    <li
                        className="flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
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
                        <div className="flex items-center justify-center p-1 rounded-full bg-blue-50 text-blue-500">
                            <DynamicSVG
                                svgData={icons.picture}
                                className="size-full"
                            />
                        </div>
                    </li>
                    <li
                        className="flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                            dispatch(toggleGifModal(!gifModalIsOpen))
                        }
                    >
                        <div className="flex items-center justify-center p-1 rounded-full bg-purple-50 text-purple-500">
                            <DynamicSVG
                                svgData={icons.gif}
                                className="size-full"
                            />
                        </div>
                    </li>
                    {/* <li
                        className="flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                            setToggleFeelings(false);
                        }}
                    >
                        <div className="flex items-center justify-center p-1 rounded-full bg-yellow-50 text-yellow-500">
                            <DynamicSVG
                                svgData={icons.feeling}
                                className="size-full"
                            />
                        </div>
                    </li> */}

                    <li
                        className="flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
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
                        <div className="flex items-center justify-center p-1 rounded-full bg-red-50 text-red-500">
                            <DynamicSVG
                                svgData={icons.video}
                                className="size-full"
                            />
                        </div>
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
