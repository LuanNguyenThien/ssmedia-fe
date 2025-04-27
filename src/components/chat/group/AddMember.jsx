import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import useDebounce from "@hooks/useDebounce";
import { userService } from "@services/api/user/user.service";
import Spinner from "@components/spinner/Spinner";
import Button from "@components/button/Button";
import PrimaryInput from "@components/input/PrimaryInput";
import Avatar from "@components/avatar/Avatar";
import MemberCard from "./components/MemberCard";
import { DynamicSVG } from "@components/sidebar/components/SidebarItems";
import { icons } from "@/assets/assets";
import { Utils } from "@services/utils/utils.service";
import { groupChatService } from "@/services/api/chat/group-chat.service";
import ProcessSpinner from "@/components/state/ProcessSpinner";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";

const AddMember = ({ onClose, groupId, existingMembers = [] }) => {
    const { profile } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // Memoize existingMembers to prevent unnecessary re-renders
    const memoizedExistingMembers = useMemo(
        () => existingMembers,
        [existingMembers]
    );

    // Search and member selection states
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);

    const countRef = useRef(0);
    console.log("Searching for users:", countRef.current++);

    // Search for members when the debounced search query changes
    useEffect(() => {
        const searchUsers = async () => {
            if (debouncedSearch.length < 1) {
                setSearchResults([]);
                return;
            }

            setIsLoadingMembers(true);
            try {
                const response = await userService.searchUsers(debouncedSearch);
                // Filter out users who are already in the group and the current user
                const filteredResults = response.data.search.filter(
                    (user) =>
                        user.username !== profile?.username &&
                        !memoizedExistingMembers.some(
                            (member) => member.userId === user._id
                        )
                );
                setSearchResults(filteredResults);
            } catch (error) {
                console.error("Error searching users", error);
                setSearchResults([]);
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error searching users",
                    "error",
                    dispatch
                );
            } finally {
                setIsLoadingMembers(false);
            }
        };

        searchUsers();
    }, [debouncedSearch, profile?.username, dispatch, memoizedExistingMembers]);

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

    // Handle adding members to the group
    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) {
            Utils.dispatchNotification(
                "Please select members to add",
                "error",
                dispatch
            );
            return;
        }

        try {
            setIsLoading(true);
            const memberIds = selectedMembers.map((member) => member._id);
            const response = await groupChatService.addMembers(groupId, { members: memberIds });

            // Emit socket event to notify all clients about members being added
            GroupChatUtils.emitGroupAction('add_members', {
                groupId: groupId,
                addedMembers: selectedMembers.map(member => ({
                    userId: member._id,
                    username: member.username
                }))
            });

            Utils.dispatchNotification(
                "Members added successfully!",
                "success",
                dispatch
            );
            onClose();
        } catch (error) {
            console.error("Error adding members:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error adding members",
                "error",
                dispatch
            );
        } finally {
            setIsLoading(false);
        }
    };
    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full bg-white z-[1000] flex flex-col">
            {isLoading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center z-[1000] backdrop-blur-sm">
                    <ProcessSpinner />
                </div>
            )}

            <div className="flex items-center justify-between py-4 px-4 border-b">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={onClose}
                >
                    <IoIosArrowBack className="text-xl mr-2" />
                    <span>Back</span>
                </div>
                <span className="text-xl font-bold">Add Members</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6">
                    <PrimaryInput
                        type="text"
                        name="searchMembers"
                        id="searchMembers"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for members to add"
                        labelText="Add Members"
                        icon={<FaSearch className="text-gray-400" />}
                    />
                </div>

                {selectedMembers.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">
                            Selected Members ({selectedMembers.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedMembers.map((member) => (
                                <div key={member._id} className="relative">
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
                                            className="hover:text-red-400 !size-3"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative">
                    {isLoadingMembers ? (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    ) : debouncedSearch && searchResults.length > 0 ? (
                        <div className="space-y-2">
                            {searchResults.map((user) => (
                                <MemberCard
                                    key={user._id}
                                    user={user}
                                    isSelected={selectedMembers.some(
                                        (member) => member._id === user._id
                                    )}
                                    onToggleSelect={toggleMemberSelect}
                                />
                            ))}
                        </div>
                    ) : debouncedSearch ? (
                        <div className="text-center py-4 text-gray-500">
                            No users found
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="p-4 border-t flex justify-end space-x-4">
                <Button
                    label="Cancel"
                    handleClick={onClose}
                    className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                />
                <Button
                    label="Add Members"
                    handleClick={handleAddMembers}
                    className={`px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white ${
                        selectedMembers.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={selectedMembers.length === 0}
                />
            </div>
        </div>
    );
};

export default AddMember;
