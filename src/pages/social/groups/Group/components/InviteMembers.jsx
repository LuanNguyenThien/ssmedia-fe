import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaUserPlus, FaCheck } from "react-icons/fa";
import Avatar from "@components/avatar/Avatar";
import { userService } from "@services/api/user/user.service";
import { groupService } from "@/services/api/group/group.service";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "@services/utils/utils.service";
const InviteMembers = ({ isOpen, onClose, groupId, groupName }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState(new Set());
    const [isInviting, setIsInviting] = useState(false);
    const dispatch = useDispatch();
    // Mock search function - replace with actual API call
    const searchUsers = async (term) => {
        if (!term.trim()) {
            setSearchResult([]);
            return;
        }
         const response = await userService.searchUsers(term);
         console.log("Search response:", response);

         setSearchResult(response.data.search || []);
        setIsSearching(true);
        
        // Simulate API call delay
        setTimeout(() => {
            // Mock user data - replace with actual API call
            const mockUsers = [
                {
                    _id: "1",
                    username: "john_doe",
                    profilePicture: "",
                    avatarColor: "#3B82F6",
                    email: "john@example.com"
                },
                {
                    _id: "2",
                    username: "jane_smith",
                    profilePicture: "",
                    avatarColor: "#10B981",
                    email: "jane@example.com"
                },
                {
                    _id: "3",
                    username: "mike_wilson",
                    profilePicture: "",
                    avatarColor: "#F59E0B",
                    email: "mike@example.com"
                },
                {
                    _id: "4",
                    username: "sarah_johnson",
                    profilePicture: "",
                    avatarColor: "#EF4444",
                    email: "sarah@example.com"
                }
            ];

            const filteredUsers = mockUsers.filter(user =>
                user.username.toLowerCase().includes(term.toLowerCase()) ||
                user.email.toLowerCase().includes(term.toLowerCase())
            );

           
            setIsSearching(false);
        }, 500);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchUsers(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleInviteUser = async (user) => {
      setIsInviting(true);
      console.log("Inviting user:", user);
      const userId = user._id;
      console.log("Group ID:", userId);
      try {
        const response = await groupService.inviteUserToGroup(groupId, [userId]);
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const isUserInvited = (userId) => invitedUsers.has(userId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Invite Members</h2>
                        <p className="text-sm text-gray-500">Invite people to join {groupName}</p>
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
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
                                            onClick={() => handleInviteUser(user)}
                                            disabled={isUserInvited(user._id) || isInviting}
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

                        {searchTerm && isSearching && searchResult.length === 0 && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-3 text-gray-500">Searching...</p>
                            </div>
                        )}

                        {searchTerm && !isSearching && searchResult.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-medium">Nothing found</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    We couldn't find any match for "{searchTerm}"
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
                            {invitedUsers.size} invitation{invitedUsers.size !== 1 ? 's' : ''} sent
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
};

export default InviteMembers; 