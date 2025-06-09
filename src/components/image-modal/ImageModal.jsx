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
import ReactDOM from "react-dom";

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
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    
    // Touch handling state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    // Determine if we're in portrait or landscape orientation based on rotation
    const isPortraitOrientation = rotation === 90 || rotation === 270;

    // Get cursor position relative to image
    const getCursorPosition = useCallback((e, element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        return {
            x: e.clientX - centerX,
            y: e.clientY - centerY
        };
    }, []);

    // Zoom toward a specific point
    const zoomToPoint = useCallback((newZoomLevel, cursorPos = { x: 0, y: 0 }) => {
        const zoomFactor = newZoomLevel / zoomLevel;
        
        setPanOffset(prev => ({
            x: prev.x - (cursorPos.x * (zoomFactor - 1)),
            y: prev.y - (cursorPos.y * (zoomFactor - 1))
        }));
        
        setZoomLevel(newZoomLevel);
    }, [zoomLevel]);

    // Event handlers with explicit stopPropagation
    const handleZoomIn = useCallback((e) => {
        e.stopPropagation();
        const newZoom = Math.min(zoomLevel + 0.25, 3);
        if (imageRef.current) {
            const cursorPos = getCursorPosition(e, imageRef.current);
            zoomToPoint(newZoom, cursorPos);
        } else {
            setZoomLevel(newZoom);
        }
    }, [zoomLevel, getCursorPosition, zoomToPoint]);

    const handleZoomOut = useCallback((e) => {
        e.stopPropagation();
        const newZoom = Math.max(zoomLevel - 0.25, 0.5);
        if (imageRef.current) {
            const cursorPos = getCursorPosition(e, imageRef.current);
            zoomToPoint(newZoom, cursorPos);
        } else {
            setZoomLevel(newZoom);
        }
    }, [zoomLevel, getCursorPosition, zoomToPoint]);

    const handleReset = useCallback((e) => {
        e.stopPropagation();
        setZoomLevel(1);
        setRotation(0);
        setPanOffset({ x: 0, y: 0 });
    }, []);

    const handleRotate = useCallback((e) => {
        e.stopPropagation();
        setRotation((prev) => (prev + 90) % 360);
        setPanOffset({ x: 0, y: 0 }); // Reset pan when rotating
    }, []);

    // Mouse wheel zoom handler
    const handleWheel = useCallback((e) => {
        if (!e.ctrlKey && !e.metaKey) return; // Only zoom with Ctrl/Cmd held
        
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 3);
        
        if (imageRef.current) {
            const cursorPos = getCursorPosition(e, imageRef.current);
            zoomToPoint(newZoom, cursorPos);
        }
    }, [zoomLevel, getCursorPosition, zoomToPoint]);

    // Pan handlers
    const handleMouseDown = useCallback((e) => {
        if (zoomLevel <= 1) return; // Only pan when zoomed in
        
        e.preventDefault();
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
    }, [zoomLevel]);

    const handleMouseMove = useCallback((e) => {
        if (!isPanning || zoomLevel <= 1) return;
        
        e.preventDefault();
        const deltaX = e.clientX - lastPanPoint.x;
        const deltaY = e.clientY - lastPanPoint.y;
        
        setPanOffset(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
        }));
        
        setLastPanPoint({ x: e.clientX, y: e.clientY });
    }, [isPanning, lastPanPoint, zoomLevel]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    // Double-click to zoom
    const handleDoubleClick = useCallback((e) => {
        e.stopPropagation();
        
        if (zoomLevel === 1) {
            // Zoom in to cursor position
            const cursorPos = getCursorPosition(e, imageRef.current);
            zoomToPoint(2, cursorPos);
        } else {
            // Reset zoom
            handleReset(e);
        }
    }, [zoomLevel, getCursorPosition, zoomToPoint, handleReset]);

    const handleDownload = useCallback(
        async (e) => {
            e.stopPropagation();

            try {
                setIsDownloading(true);

                const response = await fetch(image);
                if (!response.ok) throw new Error("Image download failed");

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                const fileName = image.split("/").pop() || "image";

                const link = document.createElement("a");
                link.href = objectUrl;
                link.download = fileName;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();

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

    const handleCancel = useCallback(
        (e) => {
            e.stopPropagation();
            onCancel();
        },
        [onCancel]
    );

    // Touch event handlers for swiping
    const handleTouchStart = useCallback((e) => {
        setTouchEnd(null);
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const handleTouchMove = useCallback((e) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;
        
        const xDistance = touchStart.x - touchEnd.x;
        const yDistance = touchStart.y - touchEnd.y;
        
        if (Math.abs(xDistance) > Math.abs(yDistance) && Math.abs(xDistance) > minSwipeDistance) {
            if (xDistance > 0 && !lastItemRight) {
                onClickRight();
            } else if (xDistance < 0 && !lastItemLeft) {
                onClickLeft();
            }
        }
        
        setTouchStart(null);
        setTouchEnd(null);
    }, [touchStart, touchEnd, onClickLeft, onClickRight, lastItemLeft, lastItemRight]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "+" || (e.key === "=" && e.shiftKey)) {
                const newZoom = Math.min(zoomLevel + 0.25, 3);
                setZoomLevel(newZoom);
            } else if (e.key === "-") {
                const newZoom = Math.max(zoomLevel - 0.25, 0.5);
                setZoomLevel(newZoom);
            } else if (e.key === "r") {
                setRotation((prev) => (prev + 90) % 360);
                setPanOffset({ x: 0, y: 0 });
            } else if (e.key === "0") {
                setZoomLevel(1);
                setRotation(0);
                setPanOffset({ x: 0, y: 0 });
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

        const handleGlobalMouseUp = () => {
            setIsPanning(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mouseup", handleGlobalMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [
        image,
        onClickLeft,
        onClickRight,
        onCancel,
        lastItemLeft,
        lastItemRight,
        zoomLevel,
        handleMouseMove,
    ]);

    const modalContent = (
        <div
            onClick={onCancel}
            className="z-[5000] fixed inset-0 h-screen w-screen flex items-center justify-center p-2 sm:p-10 bg-primary-black/50 backdrop-blur-md"
            data-testid="image-modal"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="size-full relative flex flex-col items-center justify-center rounded-lg">
                {showArrow && (
                    <div
                        className="image-modal-icon-left hidden sm:flex"
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
                    ref={containerRef}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative flex flex-col items-center transition-all duration-300 ${
                        isPortraitOrientation ? 'rotate-container-portrait' : 'rotate-container-landscape'
                    }`}
                    style={{
                        maxHeight: isPortraitOrientation ? '90vw' : '90vh',
                        maxWidth: isPortraitOrientation ? '90vh' : '90vw',
                    }}
                    onWheel={handleWheel}
                >
                    <div 
                        className="overflow-hidden rounded-lg relative select-none"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isPanning ? 'none' : 'transform 0.3s ease',
                            cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onDoubleClick={handleDoubleClick}
                    >
                        <img
                            ref={imageRef}
                            className="size-full object-contain transition-transform"
                            alt=""
                            src={`${image}`}
                            style={{
                                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                                transformOrigin: "center",
                                maxHeight: isPortraitOrientation ? '80vw' : '80vh',
                                maxWidth: isPortraitOrientation ? '80vh' : '80vw',
                                transition: isPanning ? 'none' : 'transform 0.2s ease',
                                userSelect: 'none',
                                pointerEvents: zoomLevel > 1 ? 'auto' : 'none',
                            }}
                            draggable={false}
                        />
                    </div>
                    <div
                        className="absolute text-2xl top-2 right-2 sm:-top-10 sm:-right-10 z-50 text-red-200 hover:text-red-400 cursor-pointer bg-black/30 sm:bg-transparent rounded-full p-2 sm:p-0"
                        onClick={handleCancel}
                    >
                        <FaTimes />
                    </div>
                </div>

                <div
                    className="mt-4 bg-white/10 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg flex items-center gap-3 sm:gap-6 overflow-x-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        className="text-white text-xl hover:text-primary transition-colors disabled:text-gray-500 p-2 touch-manipulation"
                        title="Zoom out (-)"
                    >
                        <IoMdRemove />
                    </button>

                    <div className="text-white text-sm px-2 whitespace-nowrap">
                        {Math.round(zoomLevel * 100)}%
                    </div>

                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                        className="text-white text-xl hover:text-primary transition-colors disabled:text-gray-500 p-2 touch-manipulation"
                        title="Zoom in (+)"
                    >
                        <IoMdAdd />
                    </button>

                    <div className="h-6 w-[1px] bg-white/30"></div>

                    <button
                        onClick={handleRotate}
                        className="text-white text-xl hover:text-primary transition-colors p-2 touch-manipulation"
                        title="Rotate (R)"
                    >
                        <IoIosRefresh />
                    </button>

                    <button
                        onClick={handleReset}
                        className="text-white text-sm hover:text-primary transition-colors p-2 touch-manipulation"
                        title="Reset (0)"
                    >
                        Reset
                    </button>

                    <div className="h-6 w-[1px] bg-white/30"></div>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="text-white text-xl hover:text-primary transition-colors relative flex items-center justify-center p-2 touch-manipulation"
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
                        className="image-modal-icon-right hidden sm:flex"
                        onClick={handleRightArrowClick}
                        style={{
                            pointerEvents: `${lastItemRight ? "none" : "all"}`,
                            color: `${lastItemRight ? "#bdbdbd" : ""}`,
                        }}
                    >
                        <FaArrowRight />
                    </div>
                )}

                {/* Zoom instruction overlay */}
                {zoomLevel === 1 && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 text-sm bg-black/40 px-3 py-1 rounded-lg pointer-events-none">
                        Hold Ctrl + scroll to zoom • Double-click to zoom in
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.body
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
