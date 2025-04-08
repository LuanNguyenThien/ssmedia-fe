import { MdFolderDelete } from "react-icons/md";
import { RxInfoCircled } from "react-icons/rx";
import { PiWarning } from "react-icons/pi";

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
    const renderIcon = () => {
        switch (icon) {
            case "delete":
                return <MdFolderDelete className="text-[75px] text-red-500" />;
            case "info":
                return <RxInfoCircled className="text-[75px] text-blue-500" />;
            case "warning":
                return <PiWarning className="text-[75px] text-yellow-500" />;
            default:
                return null;
        }
    };
    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[10000]">
            <div className="absolute top-5 p-6 w-[90vw] max-w-md flex flex-col h-auto gap-2 bg-primary-white shadow-md border backdrop-blur-sm border-gray-100 rounded-lg animate-fadeInTop">
                <div className="flex items-center gap-2">
                    <div className="h-full ">{renderIcon()}</div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xl font-bold text-primary-black w-max">
                            {title || "Do you want to process this action?"}
                        </span>
                        <span className="mb-2">
                            {subTitle || "Make sure you want to do it"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center space-x-2">
                    <div
                        onClick={handleCancel}
                        className={` text-primary-black px-4 py-2 rounded-md cursor-pointer  ${
                            classNameButtonCancel
                                ? classNameButtonCancel
                                : "bg-background-blur hover:bg-background-blur/70"
                        }`}
                    >
                        {labelButtonCancel || "Cancel"}
                    </div>
                    <div
                        onClick={handleConfirm}
                        className={` text-primary-white px-4 py-2 rounded-md cursor-pointer  ${
                            classNameButtonConfirm
                                ? classNameButtonConfirm
                                : "bg-primary hover:bg-primary/70"
                        }`}
                    >
                        {labelButtonConfirm || "Confirm"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
