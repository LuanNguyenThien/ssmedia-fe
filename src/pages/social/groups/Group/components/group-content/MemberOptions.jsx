import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserMinus, FaFlag } from "react-icons/fa";

const MemberOptions = ({ 
    member, 
    isGroupAdmin, 
    currentUserRole,
    onRemoveMember,
    onReportMember
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (action) => {
        action();
        setIsOpen(false);
    };

    // Don't show options for admins or if user doesn't have permissions
    if (member.role === "admin" || (!isGroupAdmin && currentUserRole !== "admin")) {
        return null;
    }

    const memberOptions = [];

    // Admin-only option: Remove member
    if (isGroupAdmin || currentUserRole === "admin") {
        memberOptions.push({
            label: "Remove from Group",
            icon: FaUserMinus,
            action: () => onRemoveMember(member),
            className: "text-red-600 hover:bg-red-50",
            dangerous: true
        });
    }

    // Universal option: Report member (available to all members)
    memberOptions.push({
        label: "Report Member",
        icon: FaFlag,
        action: () => onReportMember(member),
        className: "text-red-600 hover:bg-red-50",
        dangerous: true
    });

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggleDropdown}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Member options"
            >
                <HiDotsVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                    {memberOptions.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option.action)}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${option.className}`}
                        >
                            <option.icon size={14} />
                            {option.label}
                        </button>
                    ))}
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