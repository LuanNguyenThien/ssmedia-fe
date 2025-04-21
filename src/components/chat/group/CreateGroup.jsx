import { useState, useRef, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Avatar from "@components/avatar/Avatar";
import Button from "@components/button/Button";
import PrimaryInput from "@components/input/PrimaryInput";
import { FaCamera, FaSearch, FaUser, FaInfoCircle } from "react-icons/fa";
import ImagePreview from "@components/chat/image-preview/ImagePreview";
import { useSelector } from "react-redux";
import useDebounce from "@hooks/useDebounce";
import { userService } from "@services/api/user/user.service";
import Spinner from "@components/spinner/Spinner";
import "./CreateGroup.scss";
import MemberCard from "./components/MemberCard";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import { groupChatService } from "@/services/api/chat/group-chat.service";

const CreateGroup = ({ onClickBack }) => {
    const { profile } = useSelector((state) => state.user);

    // Group details
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupAvatar, setGroupAvatar] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    // Member selection
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);

    // Search for members when the debounced search query changes
    useEffect(() => {
        const searchUsers = async () => {
            if (debouncedSearch.length < 1) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await userService.searchUsers(debouncedSearch);
                console.log("Search results:", response.data.search);
                // Filter out the current user from search results
                const filteredResults = response.data.search.filter(
                    (user) => user.username !== profile?.username
                );
                setSearchResults(filteredResults);
            } catch (error) {
                console.error("Error searching users", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchUsers();
    }, [debouncedSearch, profile?.username]);

    // Handle file selection for group avatar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
                setGroupAvatar(file);
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle member selection
    const toggleMemberSelect = (user) => {
        setSelectedMembers((prevSelected) => {
            const isAlreadySelected = prevSelected.some(
                (member) => member._id === user._id
            );

            if (isAlreadySelected) {
                return prevSelected.filter((member) => member._id !== user._id);
            } else {
                return [...prevSelected, user];
            }
        });
    };

    // Remove selected image preview
    const removeImage = () => {
        setImagePreview(null);
        setGroupAvatar(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle form submission
    const handleCreateGroup = () => {
        const groupData = {
            name: groupName,
            description: groupDescription,
            avatar: groupAvatar,
            members: selectedMembers.map((member) => member._id),
        };
        const response = groupChatService.createGroupChat(groupData);
        console.log("Group created successfully:", response);
        console.log("Group data to be sent:", groupData);
    };

    const isFormValid = groupName.trim() !== "" && selectedMembers.length > 0;

    return (
        <div className="create-group overflow-y-scroll h-full max-h-full ">
            <div className="create-group-header flex items-center justify-between py-2 ">
                <div className="back-button" onClick={onClickBack}>
                    <IoIosArrowBack className="back-icon" />
                    <span>Back</span>
                </div>
                <span className="text-xl font-bold">Create Group</span>
            </div>

            <div className="create-group-content">
                <div className="group-avatar-section">
                    <div
                        className="group-avatar-container"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Group"
                                className="group-avatar-preview"
                            />
                        ) : (
                            <div className="group-avatar-placeholder">
                                <FaCamera className="camera-icon" />
                                <span>Add Group Photo</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="group-form">
                    <div className="form-group">
                        <PrimaryInput
                            type="text"
                            name="groupName"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            labelText="Group Name"
                            icon={<FaUser className="text-gray-400" />}
                            required={true}
                        />
                    </div>

                    <div className="form-group">
                        <PrimaryInput
                            type="text"
                            name="groupDescription"
                            id="groupDescription"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Enter group description"
                            labelText="Description (Optional)"
                            icon={<FaInfoCircle className="text-gray-400" />}
                        />
                    </div>

                    <div className="form-group">
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

                    {/* Selected members display */}
                    {selectedMembers.length > 0 && (
                        <div className="selected-members">
                            <h4>Selected Members ({selectedMembers.length})</h4>
                            <div className="selected-member-avatars">
                                {selectedMembers.map((member) => (
                                    <div
                                        key={member._id}
                                        className="selected-member"
                                    >
                                        <Avatar
                                            name={member.username}
                                            bgColor={member.avatarColor}
                                            textColor="#ffffff"
                                            size={40}
                                            avatarSrc={member.profilePicture}
                                        />

                                        <div
                                            onClick={() =>
                                                toggleMemberSelect(member)
                                            }
                                            className="absolute size-4 overflow-hidden -bottom-0 -right-0 rounded-full cursor-pointer bg-primary-white flex justify-center items-center"
                                        >
                                            <DynamicSVG
                                                svgData={icons.remove}
                                                className={
                                                    " hover:text-red-400 !size-3"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search results */}
                    <div className="member-search-results">
                        {isLoading ? (
                            <div className="loading-state">
                                <Spinner />
                            </div>
                        ) : debouncedSearch && searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <MemberCard
                                    key={user._id}
                                    user={user}
                                    isSelected={selectedMembers.some(
                                        (member) => member._id === user._id
                                    )}
                                    onToggleSelect={toggleMemberSelect}
                                />
                            ))
                        ) : debouncedSearch ? (
                            <div className="no-results">No users found</div>
                        ) : null}
                    </div>
                </div>

                <div className="form-actions">
                    <Button
                        label="Cancel"
                        handleClick={onClickBack}
                        className="cancel-button"
                    />
                    <Button
                        label="Create Group"
                        handleClick={handleCreateGroup}
                        className={`create-button ${
                            !isFormValid ? "disabled" : ""
                        }`}
                        disabled={!isFormValid}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
