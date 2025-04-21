import PropTypes from "prop-types";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { useState, useCallback, useEffect, useRef } from "react";
import {
    IoMdDownload,
    IoMdAdd,
    IoMdRemove,
    IoIosRefresh,
} from "react-icons/io";
import { CgSpinner } from "react-icons/cg";

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
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const imageRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    // Event handlers with explicit stopPropagation
    const handleZoomIn = useCallback((e) => {
        e.stopPropagation();
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    }, []);

    const handleZoomOut = useCallback((e) => {
        e.stopPropagation();
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleReset = useCallback((e) => {
        e.stopPropagation();
        setZoomLevel(1);
        setRotation(0);
    }, []);

    const handleRotate = useCallback((e) => {
        e.stopPropagation();
        setRotation((prev) => (prev + 90) % 360);
    }, []);

    // Enhanced download function
    const handleDownload = useCallback(
        async (e) => {
            e.stopPropagation();

            try {
                setIsDownloading(true);

                // Fetch the image as a blob
                const response = await fetch(image);
                if (!response.ok) throw new Error("Image download failed");

                const blob = await response.blob();

                // Create object URL for the blob
                const objectUrl = URL.createObjectURL(blob);

                // Get file name from URL or use default
                const fileName = image.split("/").pop() || "image";

                // Create and trigger download link
                const link = document.createElement("a");
                link.href = objectUrl;
                link.download = fileName;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();

                // Clean up
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(objectUrl);
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 2000); 
                }, 100);
            } catch (error) {
                console.error("Download failed:", error);
            } finally {
                setIsDownloading(false);
            }
        },
        [image]
    );

    // Arrow click handlers with stopPropagation
    const handleLeftArrowClick = useCallback(
        (e) => {
            e.stopPropagation();
            if (!lastItemLeft) onClickLeft();
        },
        [lastItemLeft, onClickLeft]
    );

    const handleRightArrowClick = useCallback(
        (e) => {
            e.stopPropagation();
            if (!lastItemRight) onClickRight();
        },
        [lastItemRight, onClickRight]
    );

    // Cancel handler
    const handleCancel = useCallback(
        (e) => {
            e.stopPropagation();
            onCancel();
        },
        [onCancel]
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "+" || (e.key === "=" && e.shiftKey)) {
                setZoomLevel((prev) => Math.min(prev + 0.25, 3));
            } else if (e.key === "-") {
                setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
            } else if (e.key === "r") {
                setRotation((prev) => (prev + 90) % 360);
            } else if (e.key === "0") {
                setZoomLevel(1);
                setRotation(0);
            } else if (e.key === "d") {
                const link = document.createElement("a");
                link.href = image;
                link.download = image.split("/").pop() || "image";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (e.key === "ArrowLeft" && !lastItemLeft) {
                onClickLeft();
            } else if (e.key === "ArrowRight" && !lastItemRight) {
                onClickRight();
            } else if (e.key === "Escape") {
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        image,
        onClickLeft,
        onClickRight,
        onCancel,
        lastItemLeft,
        lastItemRight,
    ]);

    return (
        <div
            onClick={onCancel}
            className="fixed inset-0 h-screen w-screen flex items-center justify-center p-10 bg-primary-black/50 backdrop-blur-md !z-[1000]"
            data-testid="image-modal"
        >
            <div className="size-full relative flex flex-col items-center justify-center rounded-lg">
                {showArrow && (
                    <div
                        className="image-modal-icon-left"
                        onClick={handleLeftArrowClick}
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
                    className="size-auto max-h-[70vh] max-w-[70vw] rounded-lg relative flex flex-col items-center"
                >
                    <div className="overflow-hidden rounded-lg relative">
                        <img
                            ref={imageRef}
                            className="size-full object-contain transition-transform duration-200"
                            alt=""
                            src={`${image}`}
                            style={{
                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                transformOrigin: "center",
                                maxHeight: "65vh",
                            }}
                        />
                    </div>
                    <div
                        className="absolute text-2xl -top-10 -right-10 z-50 text-red-200 hover:text-red-400 cursor-pointer"
                        onClick={handleCancel}
                    >
                        <FaTimes />
                    </div>
                </div>

                {/* Image control options with explicit stopPropagation */}
                <div
                    className="mt-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex items-center gap-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        className="text-white text-xl hover:text-primary transition-colors disabled:text-gray-500"
                        title="Zoom out (-)"
                    >
                        <IoMdRemove />
                    </button>

                    <div className="text-white text-sm px-2">
                        {Math.round(zoomLevel * 100)}%
                    </div>

                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                        className="text-white text-xl hover:text-primary transition-colors disabled:text-gray-500"
                        title="Zoom in (+)"
                    >
                        <IoMdAdd />
                    </button>

                    <div className="h-6 w-[1px] bg-white/30"></div>

                    <button
                        onClick={handleRotate}
                        className="text-white text-xl hover:text-primary transition-colors"
                        title="Rotate (R)"
                    >
                        <IoIosRefresh />
                    </button>

                    <button
                        onClick={handleReset}
                        className="text-white text-sm hover:text-primary transition-colors"
                        title="Reset (0)"
                    >
                        Reset
                    </button>

                    <div className="h-6 w-[1px] bg-white/30"></div>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="text-white text-xl hover:text-primary transition-colors relative flex items-center justify-center"
                        title="Download (D)"
                    >
                        {isDownloading ? (
                            <CgSpinner className="animate-spin" />
                        ) : downloadSuccess ? (
                            <span className="text-green-400 text-sm whitespace-nowrap">
                                ✓ Saved
                            </span>
                        ) : (
                            <IoMdDownload />
                        )}
                    </button>
                </div>

                {showArrow && (
                    <div
                        className="image-modal-icon-right"
                        onClick={handleRightArrowClick}
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
