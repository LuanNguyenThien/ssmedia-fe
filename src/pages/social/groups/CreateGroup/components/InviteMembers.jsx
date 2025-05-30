import { useState } from "react";
import PropTypes from "prop-types";
import { FaUserPlus, FaSearch, FaEnvelope, FaAt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import Avatar from "@components/avatar/Avatar";

const InviteMembers = ({ invitedMembers, onInviteMember, onRemoveInvite }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [inviteMethod, setInviteMethod] = useState("username"); // username, email
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Mock search results - in real app, this would come from API
    const mockUsers = [
        {
            id: "1",
            username: "john_doe",
            email: "john@example.com",
            profilePicture: null,
            fullName: "John Doe",
            avatarColor: "#3B82F6",
        },
        {
            id: "2",
            username: "jane_smith",
            email: "jane@example.com",
            profilePicture: null,
            fullName: "Jane Smith",
            avatarColor: "#EF4444",
        },
        {
            id: "3",
            username: "mike_wilson",
            email: "mike@example.com",
            profilePicture: null,
            fullName: "Mike Wilson",
            avatarColor: "#10B981",
        },
        {
            id: "4",
            username: "sarah_johnson",
            email: "sarah@example.com",
            profilePicture: null,
            fullName: "Sarah Johnson",
            avatarColor: "#F59E0B",
        },
    ];

    const handleSearch = async (term) => {
        setSearchTerm(term);
        
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        
        // Simulate API call
        setTimeout(() => {
            const filtered = mockUsers.filter(user => {
                const searchField = inviteMethod === "email" ? user.email : user.username;
                return searchField.toLowerCase().includes(term.toLowerCase()) &&
                       !invitedMembers.some(invited => invited.id === user.id);
            });
            setSearchResults(filtered);
            setIsSearching(false);
        }, 500);
    };

    const handleInviteUser = (user) => {
        onInviteMember({
            ...user,
            inviteMethod: inviteMethod,
            invitedAt: new Date().toISOString(),
            status: "pending"
        });
        
        // Remove from search results
        setSearchResults(prev => prev.filter(u => u.id !== user.id));
        setSearchTerm("");
    };

    const handleRemoveInvitation = (memberId) => {
        onRemoveInvite(memberId);
    };

    const handleInviteByEmail = () => {
        if (searchTerm.includes("@") && !invitedMembers.some(m => m.email === searchTerm)) {
            const emailInvite = {
                id: `email_${Date.now()}`,
                email: searchTerm,
                username: searchTerm,
                fullName: searchTerm,
                inviteMethod: "email",
                invitedAt: new Date().toISOString(),
                status: "pending",
                isEmailInvite: true,
                avatarColor: "#6B7280"
            };
            onInviteMember(emailInvite);
            setSearchTerm("");
        }
    };

    return (
        <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUserPlus className="mr-2 text-blue-500" />
                Invite Members (Optional)
            </h2>

            <p className="text-gray-600 mb-4">
                Invite people to join your group. You can search by username or email address.
            </p>

            {/* Invite Method Selection */}
            <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="inviteMethod"
                        value="username"
                        checked={inviteMethod === "username"}
                        onChange={(e) => setInviteMethod(e.target.value)}
                        className="mr-2"
                    />
                    <FaAt className="mr-1 text-blue-500" />
                    Search by Username
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="inviteMethod"
                        value="email"
                        checked={inviteMethod === "email"}
                        onChange={(e) => setInviteMethod(e.target.value)}
                        className="mr-2"
                    />
                    <FaEnvelope className="mr-1 text-blue-500" />
                    Invite by Email
                </label>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={
                        inviteMethod === "email" 
                            ? "Enter email address..." 
                            : "Search for users..."
                    }
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && inviteMethod === "email" && searchTerm.includes("@")) {
                            e.preventDefault();
                            handleInviteByEmail();
                        }
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {inviteMethod === "email" && searchTerm.includes("@") && (
                    <button
                        type="button"
                        onClick={handleInviteByEmail}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <FaUserPlus />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {isSearching && (
                <div className="text-center py-4">
                    <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Searching...
                    </div>
                </div>
            )}

            {searchResults.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Search Results</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        name={user.fullName}
                                        bgColor={user.avatarColor}
                                        textColor="#ffffff"
                                        size={40}
                                        avatarSrc={user.profilePicture}
                                    />
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-800">
                                            {user.fullName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            @{user.username}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleInviteUser(user)}
                                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Invite
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invited Members List */}
            {invitedMembers.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Invited Members ({invitedMembers.length})
                    </h4>
                    <div className="space-y-2">
                        {invitedMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        name={member.fullName || member.email}
                                        bgColor={member.avatarColor}
                                        textColor="#ffffff"
                                        size={40}
                                        avatarSrc={member.profilePicture}
                                    />
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-800">
                                            {member.isEmailInvite ? member.email : member.fullName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {member.isEmailInvite ? (
                                                <span className="flex items-center">
                                                    <FaEnvelope className="mr-1" size={12} />
                                                    Email invitation
                                                </span>
                                            ) : (
                                                `@${member.username}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                        Pending
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInvitation(member.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Remove invitation"
                                    >
                                        <HiX size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {invitedMembers.length === 0 && !searchResults.length && !isSearching && (
                <div className="text-center py-8 text-gray-500">
                    <FaUserPlus className="mx-auto mb-2" size={24} />
                    <p>No members invited yet</p>
                    <p className="text-sm">Search for users or enter email addresses to invite them</p>
                </div>
            )}
        </section>
    );
};

InviteMembers.propTypes = {
    invitedMembers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string,
            email: PropTypes.string,
            fullName: PropTypes.string,
            profilePicture: PropTypes.string,
            avatarColor: PropTypes.string,
            inviteMethod: PropTypes.string,
            status: PropTypes.string,
            isEmailInvite: PropTypes.bool,
        })
    ).isRequired,
    onInviteMember: PropTypes.func.isRequired,
    onRemoveInvite: PropTypes.func.isRequired,
};

export default InviteMembers; 