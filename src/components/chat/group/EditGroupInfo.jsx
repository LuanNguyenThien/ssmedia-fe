import { useState, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Button from "@components/button/Button";
import PrimaryInput from "@components/input/PrimaryInput";
import { FaCamera, FaUser, FaInfoCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { groupChatService } from "@/services/api/chat/group-chat.service";
import { imageService } from "@services/api/image/image.service";
import { Utils } from "@services/utils/utils.service";
import ProcessSpinner from "@/components/state/ProcessSpinner";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";

const EditGroupInfo = ({ groupInfo, onClose, onSuccess }) => {
    const dispatch = useDispatch();

    // Group details
    const [groupName, setGroupName] = useState(groupInfo?.name || "");
    const [groupDescription, setGroupDescription] = useState(
        groupInfo?.description || ""
    );
    const [groupAvatar, setGroupAvatar] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        groupInfo?.profilePicture || null
    );
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);

    // Handle file selection for group avatar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupAvatar(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to server before updating group
    const uploadGroupAvatar = async () => {
        if (!groupAvatar) return { url: imagePreview };

        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const response = await imageService.addImage(
                            "/images/group-avatar",
                            event.target.result
                        );
                        resolve(response.data);
                    } catch (error) {
                        console.error("Error uploading group avatar:", error);
                        Utils.dispatchNotification(
                            error.response?.data?.message ||
                                "Error uploading image",
                            "error",
                            dispatch
                        );
                        reject(error);
                    }
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsDataURL(groupAvatar);
            });
        } catch (error) {
            console.error("Error preparing image for upload:", error);
            return { url: imagePreview };
        }
    };

    // Handle form submission
    const handleUpdateGroup = async () => {
        if (!groupInfo?._id) {
            Utils.dispatchNotification("Group ID not found", "error", dispatch);
            return;
        }

        try {
            setIsLoading(true);

            let imageData = null;
            if (groupAvatar || imagePreview) {
                imageData = await uploadGroupAvatar();
            }

            const groupData = {
                name: groupName,
                description: groupDescription,
                groupPicture: imageData ? imageData.url : null,
            };

            const response = await groupChatService.updateGroupInfo(
                groupInfo._id,
                groupData
            );

            // Emit socket event to notify all clients about group info update
            GroupChatUtils.emitGroupAction('UPDATE_GROUP', {
                groupId: groupInfo._id,
                name: groupName,
                description: groupDescription,
                profilePicture: imageData ? imageData.url : groupInfo.profilePicture,
            });

            Utils.dispatchNotification(
                "Group information updated successfully!",
                "success",
                dispatch
            );

            if (onSuccess) onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Error updating group:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Error updating group",
                "error",
                dispatch
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = groupName.trim() !== "";
    const hasChanges =
        groupName !== groupInfo?.name ||
        groupDescription !== groupInfo?.description ||
        groupAvatar !== null;

    return (
        <div className="absolute inset-0 w-full h-full bg-white z-[1000] flex flex-col">
            {isLoading && (
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center z-[1001] backdrop-blur-sm"
                    style={{ minHeight: "100%", position: "absolute" }}
                >
                    <ProcessSpinner />
                </div>
            )}

            <div className="edit-group-header flex items-center justify-between py-4 px-4">
                <div
                    className="back-button flex items-center gap-2 cursor-pointer"
                    onClick={onClose}
                >
                    <IoIosArrowBack className="text-xl" />
                    <span>Cancel</span>
                </div>
                <span className="text-xl font-bold">Edit Group</span>
            </div>
            {/* Divider line */}
            <div className="w-full h-auto flex justify-center">
                <div className="h-[1px] w-2/3 bg-gray-200" />
            </div>

            <div className="edit-group-content flex-1 p-4 overflow-y-auto">
                <div className="group-avatar-section flex justify-center">
                    <div
                        className="group-avatar-container relative w-24 h-24 rounded-full cursor-pointer overflow-hidden"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Group"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                                <FaCamera className="text-gray-500 text-xl mb-1" />
                                <span className="text-xs text-gray-500">
                                    Change Photo
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <FaCamera className="text-white text-2xl" />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="group-form space-y-6">
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
                            onChange={(e) =>
                                setGroupDescription(e.target.value)
                            }
                            placeholder="Enter group description"
                            labelText="Description (Optional)"
                            icon={<FaInfoCircle className="text-gray-400" />}
                        />
                    </div>
                </div>
            </div>
            {/* Divider line */}
            <div className="w-full h-auto flex justify-center">
                <div className="h-[1px] w-2/3 bg-gray-200" />
            </div>
            <div className="form-actions p-4 flex justify-end space-x-4">
                <Button
                    label="Cancel"
                    handleClick={onClose}
                    className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md"
                />
                <Button
                    label="Save Changes"
                    handleClick={handleUpdateGroup}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
                        !isFormValid || !hasChanges
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={!isFormValid || !hasChanges}
                />
            </div>
        </div>
    );
};

export default EditGroupInfo;
