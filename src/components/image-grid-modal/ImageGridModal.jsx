import PropTypes from "prop-types";
import "@components/image-grid-modal/ImageGridModal.scss";
import ReactionWrapper from "@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper";
import { Utils } from "@services/utils/utils.service";

const ImageGridModal = ({ images, closeModal, selectedImage }) => {
    return (
        <ReactionWrapper closeModal={closeModal}>
            <div className="w-full text-center ">
                <span className="text-xl font-bold ">
                    Select your Photo
                </span>
            </div>
            <div className="modal-image-container grid grid-cols-2 md:grid-cols-3 gap-1 max-h-full overflow-auto">
                {images.map((data, index) => (
                    <div className="w-full h-auto group rounded-md overflow-hidden max-h-60 cursor-pointer" key={index}>
                        <img
                            key={index}
                            className="grid-image size-full border object-cover transform group-hover:scale-110 duration-200 ease-linear"
                            alt=""
                            src={`${Utils.getImage(
                                data?.imgId,
                                data?.imgVersion
                            )}`}
                            onClick={() => {
                                selectedImage(
                                    Utils.getImage(
                                        data?.imgId,
                                        data?.imgVersion
                                    )
                                );
                                closeModal();
                            }}
                        />
                    </div>
                ))}
            </div>
        </ReactionWrapper>
    );
};

ImageGridModal.propTypes = {
    images: PropTypes.array,
    closeModal: PropTypes.func,
    selectedImage: PropTypes.func,
};

export default ImageGridModal;
