import React, { useRef } from "react";

import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";

const ChatOptionsSelector = ({
    onCreateGroup,
    onViewInvitations,
    isHasInvitation,
}) => {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useDetectOutsideClick(dropdownRef, false);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (callback) => (e) => {
        e.stopPropagation();
        callback();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center justify-center p-1 transition-colors "
                aria-label="Chat options"
            >
                <DynamicSVG
                    svgData={icons.edit}
                    className="size-5 text-primary-black hover:!text-primary/50 text-2xl"
                />
                {isHasInvitation > 0 && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white rounded-full size-2 animate__animated animate__pulse animate__infinite"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-8 w-max bg-white rounded-lg shadow-lg p-2 z-20 border border-gray-200 animate-fadeIn">
                    <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={handleOptionClick(onCreateGroup)}
                    >
                        <DynamicSVG
                            svgData={icons.groups}
                            className=" size-4 text-primary-black text-lg"
                        />
                        <span>Create new group</span>
                    </div>
                    <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 relative"
                        onClick={handleOptionClick(onViewInvitations)}
                    >
                        <DynamicSVG
                            svgData={icons.envelope}
                            className=" size-4 text-primary-black text-lg"
                        />
                        <span>Group invitations</span>

                        {isHasInvitation>0 && (
                            <span className="text-sm bg-background-blur px-1 rounded-[30px] text-primary">
                                {isHasInvitation}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatOptionsSelector;
