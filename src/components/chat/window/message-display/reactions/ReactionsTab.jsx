import { reactionsMap } from "@/services/utils/static.data";
import { Utils } from "@/services/utils/utils.service";
import Avatar from "@components/avatar/Avatar";
import { useMemo, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";

const ReactionsTab = ({
    reactions = [],
    groupChatData = [],
    onRemoveReaction,
    onCloseReactionTab,
}) => {
    const { profile } = useSelector((state) => state.user);
    const isMobile = Utils.isMobileDevice();
    const reactionsRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(reactionsRef, true);

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

    const mobileClasses =
        "fixed z-[100] bottom-0 left-0 bg-white shadow-md border-t w-screen h-max max-h-1/2 flex flex-col justify-between gap-2  rounded-t-2xl p-4";
    const desktopClasses =
        "fixed z-[100] w-max h-max left-1/2 bottom-1/2 border translate-y-1/2 bg-primary-white p-6  shadow-md rounded-[10px] flex flex-col justify-between -translate-x-1/2";
    const animationClasses = `transition-all duration-700 ease-out delay-150 ${
        isActive
            ? isMobile
                ? "translate-y-0 opacity-100"
                : "scale-100 opacity-100"
            : isMobile
            ? "translate-y-full opacity-0"
            : "scale-75 opacity-0"
    }`;

    useEffect(() => {
        if (!isActive) {
            onCloseReactionTab();
        }
    }, [isActive, onCloseReactionTab]);

    return (
        <div
            ref={reactionsRef}
            className={`${
                isMobile ? mobileClasses : desktopClasses
            } ${animationClasses}`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
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
                <div
                    onClick={onRemoveReaction}
                    className="w-full py-2 mt-4 text-primary-black flex items-center justify-center gap-2 bg-background-blur hover:text-red-500 cursor-pointer rounded-lg transition-colors"
                >
                    <FaTimes />
                    <span>Remove your reaction</span>
                </div>
            )}
        </div>
    );
};

export default ReactionsTab;
