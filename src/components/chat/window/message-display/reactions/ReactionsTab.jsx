import { reactionsMap } from "@/services/utils/static.data";
import { Utils } from "@/services/utils/utils.service";
import Avatar from "@components/avatar/Avatar";
import { useMemo, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const ReactionsTab = ({
    reactions = [],
    groupChatData = [],
    onRemoveReaction = () => {},
    isOpen = true,
    onClose = () => {},
}) => {
    const { profile } = useSelector((state) => state.user);
    const isMobile = Utils.isMobileDevice();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => {
                setIsVisible(true);
            }, 50);
        } else if (isVisible) {
            setIsVisible(false);
            timer = setTimeout(() => {
                onClose();
            }, 350);
        }
        return () => clearTimeout(timer);
    }, [isOpen, isVisible, onClose]);

    // Find if current user has reacted
    const getImage = (userName) => {
        return groupChatData.find((user) => user.username === userName)
            ?.profilePicture;
    };
    const isCurrentReacted = useMemo(() => {
        return reactions.some(
            (reaction) => reaction.senderName === profile.username
        );
    }, [reactions, profile.username]);

    // Base classes for mobile and desktop
    const mobileClasses =
        "fixed bottom-0 left-0 bg-white shadow-md border-t w-screen h-max max-h-1/2 flex flex-col justify-between gap-2 z-[5002] rounded-t-2xl p-4";
    const desktopClasses =
        "fixed  w-1/3 h-max left-1/2 bottom-1/2 border translate-y-1/2 bg-primary-white p-6 z-[10000] shadow-md rounded-[10px] flex flex-col justify-between -translate-x-1/2";

    // Animation classes
    const animationClasses = `transition-all duration-300 ease-in-out ${
        isVisible
            ? isMobile
                ? "translate-y-0 opacity-100"
                : "scale-100 opacity-100"
            : isMobile
            ? "translate-y-full opacity-0"
            : "scale-90 opacity-0"
    }`;

    console.log("ReactionsTab rendered", reactions);

    return (
        <div
            className={`${
                isMobile ? mobileClasses : desktopClasses
            } ${animationClasses}`}
        >
            <h3 className="text-xl px-4 font-bold mb-3 text-gray-800 ">
                Reactions
            </h3>

            <div className="overflow-y-auto max-h-64 pr-1">
                {reactions.map((reaction, index) => (
                    <div
                        key={index}
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 gap-3"
                    >
                        <Avatar
                            avatarSrc={getImage(reaction.senderName)}
                            textColor="#ffffff"
                            size={40}
                        />

                        <div className=" flex-1 flex items-center justify-start gap-1">
                            <span className="font-medium text-sm">
                                {reaction.senderName}
                                <span> reacted with</span>
                            </span>
                        </div>

                        <div className="size-6">
                            <img src={reactionsMap[reaction.type]} alt="" />
                        </div>
                    </div>
                ))}
            </div>

            {isCurrentReacted && (
                <button
                    onClick={onRemoveReaction}
                    className="w-full py-2 mt-4 text-primary-black flex items-center justify-center gap-2 bg-background-blur hover:bg-red-100 rounded-lg transition-colors"
                >
                    <FaTimes />
                    <span>Remove your reaction</span>
                </button>
            )}
        </div>
    );
};

export default ReactionsTab;
