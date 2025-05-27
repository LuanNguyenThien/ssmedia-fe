import { MdFolderDelete } from "react-icons/md";
import { RxInfoCircled } from "react-icons/rx";
import { PiWarning } from "react-icons/pi";
import { useEffect } from "react";
import useIsMobile from "@hooks/useIsMobile";

const ConfirmModal = ({
    title,
    subTitle,
    handleConfirm,
    handleCancel,
    labelButtonCancel,
    labelButtonConfirm,
    classNameButtonCancel,
    classNameButtonConfirm,
    icon,
}) => {
    const isMobile = useIsMobile();

    // Add escape key handler
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                handleCancel();
            }
        };
        
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [handleCancel]);

    const renderIcon = () => {
        switch (icon) {
            case "delete":
                return <MdFolderDelete className="text-[70px] text-red-500" />;
            case "info":
                return <RxInfoCircled className="text-[70px] text-blue-500" />;
            case "warning":
                return <PiWarning className="text-[70px] text-yellow-500" />;
            default:
                return null;
        }
    };

    const handleClickConfirm = () => {
        try {
            if (typeof handleConfirm === "function") {
                handleConfirm();
            } else {
                console.error(
                    "handleConfirm is not a function:",
                    handleConfirm
                );
            }
        } catch (error) {
            console.error("Error in handleConfirm:", error);
        }
    };
    const handleClickCancel = () => {
        handleCancel();
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-x-hidden flex items-start justify-center py-4 px-6"
        >
            {/* Dialog backdrop - handles outside click */}
            <div 
                className="fixed inset-0" 
                aria-hidden="true" 
                onClick={handleCancel}
            ></div>

            <div className={`relative bg-white ${isMobile ? 'w-full max-w-[90%]' : 'w-full max-w-md'} rounded-[30px] border border-gray-200 shadow-lg transform transition-all animate-fadeInTop`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="py-6 px-10">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{renderIcon()}</div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-primary-black">
                                {title || "Do you want to process this action?"}
                            </h3>
                            <p className="text-gray-600">
                                {subTitle || "Make sure you want to do it"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClickCancel();
                            }}
                            className={`px-4 py-2 border uppercase text-sm rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors ${
                                classNameButtonCancel
                                    ? classNameButtonCancel
                                    : "border-gray-300"
                            }`}
                        >
                            {labelButtonCancel || "Cancel"}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClickConfirm();
                            }}
                            className={`px-4 py-2 rounded-lg uppercase text-sm text-white transition-colors ${
                                classNameButtonConfirm
                                    ? classNameButtonConfirm
                                    : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {labelButtonConfirm || "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
