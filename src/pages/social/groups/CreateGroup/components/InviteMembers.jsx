
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import Avatar from "@components/avatar/Avatar";
import PrimaryInput from "@components/input/PrimaryInput";
import Spinner from "@components/spinner/Spinner";
import { useSelector } from "react-redux";
import useDebounce from "@hooks/useDebounce";
import { userService } from "@services/api/user/user.service";

// Component MemberCard để hiển thị từng kết quả tìm kiếm
const MemberCard = ({ user, isSelected, onToggleSelect }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border-blue-500" : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={() => onToggleSelect(user)}
    >
      <div className="flex items-center">
        <Avatar
          name={user.username}
          bgColor={user.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={user.profilePicture}
        />
        <div className="ml-3">
          <div className="font-medium text-gray-800">{user.username}</div>
        </div>
      </div>
      <span className="text-sm text-blue-500">{isSelected ? "Selected" : "Select"}</span>
    </div>
  );
};

MemberCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatarColor: PropTypes.string,
    profilePicture: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
};

const InviteMembers = ({ invitedMembers, onInviteMember, onRemoveInvite }) => {
  const { profile } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMember, setIsLoadingMember] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Search for members when the debounced search query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedSearch.length < 1) {
        setSearchResults([]);
        return;
      }

      setIsLoadingMember(true);
      try {
        const response = await userService.searchUsers(debouncedSearch);
        const filteredResults = response.data.search
          .filter((user) => user.username !== profile?.username)
          .filter((user) => !invitedMembers.some((member) => member.userId === user._id));
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsLoadingMember(false);
      }
    };

    searchUsers();
  }, [debouncedSearch, profile?.username, invitedMembers]);

  // Toggle member selection
  const toggleMemberSelect = (user) => {
    const isAlreadySelected = invitedMembers.some((member) => member.userId === user._id);

    if (isAlreadySelected) {
      onRemoveInvite(user._id);
    } else {
      onInviteMember({
        userId: user._id,
        username: user.username,
        avatarColor: user.avatarColor || "#000000",
        profilePicture: user.profilePicture || "",
        joinedAt: new Date().toISOString(),
        role: "member",
        joinedBy: "invited",
        status: "pending",
        invitedBy: localStorage.getItem("userId") || "",
      });
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaUserPlus className="mr-2 text-blue-500" />
        Invite Members
      </h2>

      <p className="text-gray-600 mb-4">
        Search for users to invite them to your group.
      </p>

      {/* Search Input */}
      <div className="form-group mb-4">
        <PrimaryInput
          type="text"
          name="searchMembers"
          id="searchMembers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for members"
          labelText="Add Members"
          icon={<FaSearch className="text-gray-400" />}
        />
      </div>

      {/* Selected Members */}
      {invitedMembers.length > 0 && (
        <div className="selected-members mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Members ({invitedMembers.length})
          </h4>
          <div className="flex flex-wrap gap-4">
            {invitedMembers.map((member) => (
              <div key={member.userId} className="selected-member relative">
                <Avatar
                  name={member.username}
                  bgColor={member.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={member.profilePicture}
                />
                <div
                  onClick={() => onRemoveInvite(member.userId)}
                  className="absolute size-4 overflow-hidden -bottom-0 -right-0 rounded-full cursor-pointer bg-primary-white flex justify-center items-center"
                >
                  <DynamicSVG
                    svgData={icons.remove}
                    className="hover:text-red-400 !size-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="member-search-results relative">
        {isLoadingMember ? (
          <div className="loading-state text-center py-4">
            <Spinner />
          </div>
        ) : debouncedSearch && searchResults.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((user) => (
              <MemberCard
                key={user._id}
                user={user}
                isSelected={invitedMembers.some((member) => member.userId === user._id)}
                onToggleSelect={toggleMemberSelect}
              />
            ))}
          </div>
        ) : debouncedSearch ? (
          <div className="no-results text-center py-4 text-gray-500">No users found</div>
        ) : null}
      </div>

      {invitedMembers.length === 0 && !searchResults.length && !isLoadingMember && (
        <div className="text-center py-8 text-gray-500">
          <FaUserPlus className="mx-auto mb-2" size={24} />
          <p>No members invited yet</p>
          <p className="text-sm">Search for users to invite them</p>
        </div>
      )}
    </section>
  );
};

InviteMembers.propTypes = {
  invitedMembers: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatarColor: PropTypes.string,
      profilePicture: PropTypes.string,
      joinedAt: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      joinedBy: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      invitedBy: PropTypes.string.isRequired,
    })
  ).isRequired,
  onInviteMember: PropTypes.func.isRequired,
  onRemoveInvite: PropTypes.func.isRequired,
};

export default InviteMembers;
