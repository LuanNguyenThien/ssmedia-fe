import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserMinus, FaFlag } from "react-icons/fa";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";

const MemberOptions = ({
    member,
    isGroupAdmin,
    currentUserRole,
    onRemoveMember,
    onReportMember,
}) => {
    const memberOptionRef = useRef(null);
    const [isOpen, setIsOpen] = useDetectOutsideClick(memberOptionRef, false);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (action) => {
        action();
        setIsOpen(false);
    };
    const memberOptions = [];
    // Admin-only option: Remove member
    if (isGroupAdmin) {
        memberOptions.push({
            label: "Remove from Group",
            icon: FaUserMinus,
            action: () => onRemoveMember(member),
            dangerous: true,
        });
    }

    // Universal option: Report member (available to all members)
    memberOptions.push({
        label: "Report Member",
        icon: FaFlag,
        action: () => onReportMember(member),
        dangerous: true,
    });

    return (
        <div className="relative">
            <button
                ref={memberOptionRef}
                onClick={handleToggleDropdown}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Member options"
            >
                <HiDotsVertical
                    size={16}
                    className="text-gray-600 transition-colors duration-200"
                />
            </button>

            {isOpen && (
                <div
                    className={`
                        absolute right-0 top-full mt-2 w-48 
                        bg-white border border-gray-200 rounded-lg shadow-lg z-50 
                        transform transition-all duration-200 ease-in-out
                        ${
                            isOpen
                                ? "scale-100 opacity-100 visible"
                                : "scale-95 opacity-0 invisible"
                        }
                        font-medium
                    `}
                    style={{
                        boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    <div className="py-2">
                        <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide font-semibold border-b border-gray-100">
                            Actions
                        </div>
                        {memberOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option.action)}
                                className="w-full px-4 py-3 text-left hover:bg-red-500 hover:text-white flex items-center gap-3 text-gray-700 transition-all duration-200 group focus:outline-none focus:bg-red-500 focus:text-white"
                            >
                                <div className="flex items-center justify-center bg-gray-200 group-hover:bg-white group-focus:bg-white rounded-full p-2 transition-colors duration-200">
                                    <option.icon
                                        size={14}
                                        className="text-red-500 group-hover:text-red-500 group-focus:text-red-500"
                                    />
                                </div>
                                <span className="font-medium">
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

MemberOptions.propTypes = {
    member: PropTypes.object.isRequired,
    isGroupAdmin: PropTypes.bool.isRequired,
    currentUserRole: PropTypes.string.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
    onReportMember: PropTypes.func.isRequired,
};

export default MemberOptions;
