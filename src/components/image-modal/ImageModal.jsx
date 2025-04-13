import PropTypes from "prop-types";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

import "@components/image-modal/ImageModal.scss";

const ImageModal = ({
    image,
    onCancel,
    onClickLeft,
    onClickRight,
    showArrow,
    lastItemRight,
    lastItemLeft,
}) => {
    return (
        <div
            onClick={onCancel}
            className="fixed inset-0 h-screen w-screen flex items-center justify-center p-10 bg-primary-black/50 backdrop-blur-md !z-[1000]"
            data-testid="image-modal"
        >
            <div className="size-full relative flex flex-col items-center justify-center rounded-lg">
                {showArrow && (
                    <div
                        className={"image-modal-icon-left "}
                        onClick={onClickLeft}
                        style={{
                            pointerEvents: `${lastItemLeft ? "none" : "all"}`,
                            color: `${lastItemLeft ? "#bdbdbd" : ""}`,
                        }}
                    >
                        <FaArrowLeft />
                    </div>
                )}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="size-auto max-h-[70vh] max-w-[70vw] rounded-lg relative"
                >
                    <img
                        className="size-full object-fit"
                        alt=""
                        src={`${image}`}
                    />
                    <div
                        className="absolute text-2xl -top-10 -right-10 z-50 text-red-200 hover:text-red-400 cursor-pointer"
                        onClick={onCancel}
                    >
                        <FaTimes />
                    </div>
                </div>
                <div className="w-[200px] h-max bg-slate-300">
                    this is options
                </div>

                {showArrow && (
                    <div
                        className={"image-modal-icon-right"}
                        onClick={onClickRight}
                        style={{
                            pointerEvents: `${lastItemRight ? "none" : "all"}`,
                            color: `${lastItemRight ? "#bdbdbd" : ""}`,
                        }}
                    >
                        <FaArrowRight />
                    </div>
                )}
            </div>
        </div>
    );
};

ImageModal.propTypes = {
    image: PropTypes.string,
    onCancel: PropTypes.func,
    onClickRight: PropTypes.func,
    onClickLeft: PropTypes.func,
    showArrow: PropTypes.bool,
    lastItemRight: PropTypes.bool,
    lastItemLeft: PropTypes.bool,
};

export default ImageModal;
