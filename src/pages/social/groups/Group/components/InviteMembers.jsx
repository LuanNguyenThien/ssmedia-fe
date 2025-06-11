import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaUserPlus, FaCheck } from "react-icons/fa";
import Avatar from "@components/avatar/Avatar";
import { userService } from "@services/api/user/user.service";
import { groupService } from "@services/api/group/group.service";
import { useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";

const InviteMembers = ({ isOpen, onClose, groupId, groupName, group }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState(new Set());
    const [isInviting, setIsInviting] = useState(false);
    const dispatch = useDispatch();

    // Search users via API with debounce
    const searchUsers = async (term) => {
        if (!term.trim()) {
            setSearchResult([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await userService.searchUsers(term);
            setSearchResult(response.data.search || []);
        } catch (error) {
            console.error("Error searching users:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to search users",
                "error",
                dispatch
            );
            setSearchResult([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchUsers(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Handle inviting a user
    const handleInviteUser = async (user) => {
        setIsInviting(true);
        console.log(user);
        const userId = user._id;
        try {
            const response = await groupService.inviteUserToGroup(groupId, [
                userId,
            ]);
            // Update invitedUsers only after successful API call
            setInvitedUsers((prev) => new Set([...prev, user._id]));
            Utils.dispatchNotification(
                response.data?.message || "Invitation sent successfully",
                "success",
                dispatch
            );
        } catch (err) {
            console.error("Error inviting user:", err);
            Utils.dispatchNotification(
                err.response?.data?.message || "Failed to invite user",
                "error",
                dispatch
            );
        } finally {
            setIsInviting(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Check if a user is invited or already a member
    const isUserInvited = (userId) => {
        return (
            invitedUsers.has(userId) ||
            group?.members?.some((member) => member.userId === userId)
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Invite Members
                        </h2>
                        <p className="text-sm text-gray-500">
                            Invite people to join {groupName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close modal"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <FaSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search people by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto max-h-96">
                    <div className="p-2">
                        {!isSearching && searchResult.length > 0 && (
                            <div className="space-y-1">
                                {searchResult.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                name={user.username}
                                                bgColor={user.avatarColor}
                                                textColor="#ffffff"
                                                size={40}
                                                avatarSrc={user.profilePicture}
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.username}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleInviteUser(user)
                                            }
                                            disabled={
                                                isUserInvited(user._id) ||
                                                isInviting
                                            }
                                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                                isUserInvited(user._id)
                                                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                        >
                                            {isUserInvited(user._id) ? (
                                                <>
                                                    <FaCheck size={12} />
                                                    Invited
                                                </>
                                            ) : (
                                                <>
                                                    <FaUserPlus size={12} />
                                                    Invite
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchTerm &&
                            isSearching &&
                            searchResult.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-3 text-gray-500">
                                        Searching...
                                    </p>
                                </div>
                            )}

                        {searchTerm &&
                            !isSearching &&
                            searchResult.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 font-medium">
                                        Nothing found
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        We couldn't find any match for "
                                        {searchTerm}"
                                    </p>
                                </div>
                            )}

                        {!searchTerm && (
                            <div className="text-center py-8">
                                <FaSearch className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-3 text-gray-500">
                                    Start typing to search for people to invite
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {invitedUsers.size > 0 && (
                    <div className="p-4 border-t bg-gray-50">
                        <p className="text-sm text-gray-600 text-center">
                            {invitedUsers.size} invitation
                            {invitedUsers.size !== 1 ? "s" : ""} sent
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

InviteMembers.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
};

export default InviteMembers;
