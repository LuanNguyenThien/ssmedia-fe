import PropTypes from "prop-types";
import { useEffect } from "react";
import { Utils } from "@services/utils/utils.service";

const Dialog = ({
    title,
    firstButtonText,
    secondButtonText,
    firstBtnHandler,
    secondBtnHandler,
    children,
}) => {
    const isMobile = Utils.isMobileDevice();

    // Add escape key handler
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                secondBtnHandler();
            }
        };
        
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [secondBtnHandler]);

    return (
        <div className="fixed inset-0 z-50 overflow-x-hidden  flex items-center justify-center p-4" data-testid="dialog-container">
            {/* Dialog backdrop - handles outside click */}
            <div 
                className="fixed inset-0" 
                aria-hidden="true" 
                onClick={secondBtnHandler}
            ></div>
            
            {/* Dialog panel */}
            <div 
                className={`relative bg-white ${isMobile ? 'w-full max-w-[90%]' : 'w-full max-w-md'} rounded-[30px] border border-gray-200 shadow-lg transform transition-all animate-fadeInTop`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Dialog content */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        {title}
                    </h3>
                    
                    {/* Optional dialog body content */}
                    {children && (
                        <div className="mt-3 text-center">
                            {children}
                        </div>
                    )}
                </div>
                
                {/* Dialog actions */}
                <div className="flex justify-end gap-3 border-gray-200 p-4">
                    <button
                        type="button"
                        className="px-4 py-2 border uppercase border-gray-300 text-sm rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={secondBtnHandler}
                    >
                        {secondButtonText}
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg uppercase text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                        onClick={firstBtnHandler}
                    >
                        {firstButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

Dialog.propTypes = {
    title: PropTypes.string.isRequired,
    firstButtonText: PropTypes.string.isRequired,
    secondButtonText: PropTypes.string.isRequired,
    firstBtnHandler: PropTypes.func.isRequired,
    secondBtnHandler: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default Dialog;
