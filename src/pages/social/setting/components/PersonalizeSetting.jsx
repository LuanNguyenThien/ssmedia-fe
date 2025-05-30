import { useState, useCallback, useRef } from "react";
import Toggle from "@components/toggle/Toggle";
import ConfirmModal from "@components/confirm-modal/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "@/services/api/user/user.service";
import { NotificationUtils } from "@/services/utils/notification-utils.service";
import { Utils } from "@/services/utils/utils.service";

const tooltipContent = {
    clearAllPersonalize: `Remove all your personalized settings and activity history. \n

This will delete all data used to tailor responses based on your past actions, preferences, and behavior.
After this, future interactions will start fresh, without any personalization.\n

Do you want to continue?`,
    clearUserBehavior: `This will erase your current activity and behavior data. \n

Would you like to continue?`,
};

const useDebounce = (callback, delay) => {
    const timer = useRef();
    return useCallback(
        (...args) => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
};

const PersonalizeSetting = () => {
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isPersonalizeOn, setIsPersonalizeOn] = useState(
        profile?.personalizeSettings.allowPersonalize || false
    );
    const [modalType, setModalType] = useState(null); // 'personalize' | 'behavior' | null

    // Debounced API call for toggle
    const debouncedToggle = useDebounce(async (newValue) => {
        await userService.updatePersonalizeSettings({
            allowPersonalize: newValue,
        });
        setIsPersonalizeOn(newValue);
    }, 400);

    const handleTogglePersonalize = () => {
        debouncedToggle(!isPersonalizeOn);
    };

    // Modal open handlers
    const handleClearPersonalize = () => setModalType("personalize");
    const handleClearUserBehavior = () => setModalType("behavior");
    const handleCancelModal = () => setModalType(null);

    // Modal confirm handler
    const handleConfirmModal = async () => {
        if (modalType === "personalize") {
            // TODO: Call API to clear all personalize
            await userService.clearAllPersonalize();
            Utils.dispatchNotification(
                "All personalize settings have been cleared",
                "success",
                dispatch
            );
        } else if (modalType === "behavior") {
            // TODO: Call API to clear user behavior
            await userService.clearBehaviorPersonalize();
            Utils.dispatchNotification(
                "User behavior has been cleared",
                "success",
                dispatch
            );
        }
        setModalType(null);
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-6">Personalize Setting</h2>
            <div className="space-y-6">
                {/* Toggle Section */}
                <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                        <h3 className="font-medium mb-1">Personalize</h3>
                        <p className="text-sm text-gray-600">
                            Enable or disable personalized experience
                        </p>
                    </div>
                    <Toggle
                        toggle={isPersonalizeOn}
                        onClick={handleTogglePersonalize}
                    />
                </div>
                {/* Clear User Behavior Button */}
                <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">Clear User Behavior</h3>
                            <span
                                tabIndex={0}
                                aria-label="Info about clearing all personalize"
                                className="relative  cursor-pointer group w-fit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 "
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                                <div className="absolute -right-1/2 sm:left-full bottom-0  sm:top-1/2 -translate-y-1/2 h-max  ml-2 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg hidden group-hover:block group-focus:block transition-opacity z-10">
                                    {tooltipContent.clearUserBehavior}
                                </div>
                            </span>
                        </div>

                        <p className="text-sm text-gray-600">
                            Erase your activity and behavior data
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Clear user behavior"
                            tabIndex={0}
                            onClick={handleClearUserBehavior}
                            className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </div>
                {/* Clear All Personalize Button */}
                <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium ">
                                Clear All Personalize
                            </h3>
                            <span
                                tabIndex={0}
                                aria-label="Info about clearing all personalize"
                                className="relative group cursor-pointer w-fit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                                <div className="absolute -right-1/2 sm:left-full bottom-10 sm:-translate-y-1/2 h-max  sm:top-1/2  ml-2 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg hidden group-hover:block group-focus:block transition-opacity z-10">
                                    {tooltipContent.clearAllPersonalize}
                                </div>
                            </span>
                        </div>

                        <p className="text-sm text-gray-600">
                            Remove all your personalized settings
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Clear all personalize"
                            tabIndex={0}
                            onClick={handleClearPersonalize}
                            className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            {/* Confirm Modal */}
            {modalType && (
                <ConfirmModal
                    title={
                        modalType === "personalize"
                            ? "Clear All Personalize"
                            : "Clear User Behavior"
                    }
                    subTitle={
                        modalType === "personalize"
                            ? "Are you sure you want to remove all your personalized settings?"
                            : "Are you sure you want to erase your activity and behavior data?"
                    }
                    handleConfirm={handleConfirmModal}
                    handleCancel={handleCancelModal}
                    icon={modalType === "personalize" ? "delete" : "warning"}
                    labelButtonCancel="Cancel"
                    labelButtonConfirm="Confirm"
                />
            )}
        </div>
    );
};

export default PersonalizeSetting;
