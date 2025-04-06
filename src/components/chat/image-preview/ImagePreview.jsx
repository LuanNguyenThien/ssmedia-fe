import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import "@components/chat/image-preview/ImagePreview.scss";
import { DynamicSVG } from "./../../sidebar/components/SidebarItems";
import { icons } from "@assets/assets";

const ImagePreview = ({ image, onRemoveImage }) => {
    return (
        <div
            className="absolute left-0 bottom-0 h-auto border border-primary/20 bg-primary-white mb-16 w-1/3 flex items-center justify-center z-50 p-10 animate__animated animate__slideInLeft animate__faster rounded-lg shadow-lg"
            data-testid="image-preview"
        >
            <div className="image-preview">
                <img className="img" src={image} alt="" />
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage();
                    }}
                    className="text-red-200 absolute top-4 right-4 cursor-pointer hover:text-red-500"
                >
                    <DynamicSVG svgData={icons.remove} className={"size-4"} />
                </div>
            </div>
        </div>
    );

};


ImagePreview.propTypes = {
    image: PropTypes.string,
    onRemoveImage: PropTypes.func,
};
export default ImagePreview;
