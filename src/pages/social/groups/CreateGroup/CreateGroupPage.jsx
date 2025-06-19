import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "@components/input/Input";
import { FaUsers, FaCamera, FaPlus } from "react-icons/fa";
import { Utils } from "@services/utils/utils.service";
import PrivacySettings from "./components/PrivacySettings";
import InviteMembers from "./components/InviteMembers";
import { imageService } from "@services/api/image/image.service";
import { groupService } from "@services/api/group/group.service";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";
import { useDispatch, useSelector } from "react-redux";
import { groupCategories as categories } from "../group.constants";

const CreateGroupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            privacy: "public",
            categories: [],
            tags: [],
        },
    });

    // Additional state for non-form fields
    const [members, setMembers] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // Watch form values for reactive updates
    const watchedTags = watch("tags");
    const watchedPrivacy = watch("privacy");
    const watchedCategories = watch("categories");

    const handlePrivacyChange = (privacy) => {
        setValue("privacy", privacy);
    };

    const handleAddTag = () => {
        const currentTags = getValues("tags");
        if (newTag.trim() && !currentTags.includes(newTag.trim())) {
            setValue("tags", [...currentTags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const currentTags = getValues("tags");
        setValue(
            "tags",
            currentTags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleCategoryToggle = (category) => {
        const currentCategories = getValues("categories");
        if (currentCategories.includes(category)) {
            setValue(
                "categories",
                currentCategories.filter((cat) => cat !== category)
            );
        } else {
            setValue("categories", [...currentCategories, category]);
        }
    };

    // Handle file selection for group avatar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            console.log("Selected file:", file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to server
    const uploadGroupAvatar = async () => {
        if (!profileImage) return null;

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
                reader.readAsDataURL(profileImage);
            });
        } catch (error) {
            console.error("Error preparing image for upload:", error);
            return null;
        }
    };

    const handleInviteMember = (member) => {
        setMembers((prev) => [
            ...prev,
            {
                userId: member.userId,
                username: member.username || "",
                avatarColor: member.avatarColor || "#000000",
                profilePicture: member.profilePicture || "",
                joinedAt: new Date().toISOString(),
                role: "member",
                joinedBy: "invited",
                status: "pending",
                invitedBy: profile._id || "",
            },
        ]);
    };

    const handleRemoveInvite = (memberId) => {
        setMembers((prev) =>
            prev.filter((member) => member.userId !== memberId)
        );
    };

    const onSubmit = async (formData) => {
        setLoading(true);

        try {
            // Upload image
            let imageData = null;
            if (profileImage) {
                imageData = await uploadGroupAvatar();
            }

            // Prepare data for API
            const groupPayload = {
                name: formData.name,
                description: formData.description,
                privacy: formData.privacy,
                members: members,
                tags: formData.tags,
                category: formData.categories,
                profileImage: imageData
                    ? imageData.url
                    : "https://img.freepik.com/premium-vector/picture-group-people-with-arms-up-air_1087929-8284.jpg?semt=ais_hybrid&w=740",
            };

            console.log("Group Payload:", groupPayload);

            // Call API through groupService
            const response = await groupService.createGroup(groupPayload);

            Utils.dispatchNotification(
                "Group created successfully!",
                "success",
                dispatch
            );

            // Emit group event
            GroupChatUtils.emitGroupAction("CREATE_GROUP", {
                groupId: response.data.group._id,
                groupName: response.data.group.name,
                groupPicture: response.data.group.profileImage,
                members: response.data.group.members,
            });

            // Navigate
            setTimeout(() => {
                navigate(`/app/social/group/${response.data.group.id}`);
            }, 200);
        } catch (error) {
            console.error("Error creating group:", error);
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to create group",
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-blur h-[90vh] pb-[10%] w-full col-span-full max-h-screen overflow-scroll rounded-t-3xl px-0 py-6 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 rounded-2xl shadow-sm p-6">
                    <div className="mb-6 flex flex-col items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Create New Group
                        </h1>
                        <p className="text-gray-600">
                            Build a community around your interests and connect
                            with like-minded people.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Basic Information */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaUsers className="mr-2 text-blue-500" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        name="name"
                                        labelText="Group Name *"
                                        placeholder="Enter group name"
                                        {...register("name", {
                                            required: "Group name is required",
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Group name must be at least 3 characters",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "Group name must not exceed 50 characters",
                                            },
                                            pattern: {
                                                value: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
                                                message:
                                                    "Group name must contain only letters, numbers, and spaces",
                                            },
                                        })}
                                        className={`border rounded-lg ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe what your group is about..."
                                        {...register("description")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block font-medium text-gray-700 mb-2">
                                        Categories * (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                        {categories.map((category) => (
                                            <label
                                                key={category}
                                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={category}
                                                    checked={watchedCategories.includes(
                                                        category
                                                    )}
                                                    onChange={() =>
                                                        handleCategoryToggle(
                                                            category
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {watchedCategories.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Selected categories:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {watchedCategories.map(
                                                    (category) => (
                                                        <span
                                                            key={category}
                                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                        >
                                                            {category}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCategoryToggle(
                                                                        category
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* Custom validation for categories */}
                                    <input
                                        type="hidden"
                                        {...register("categories", {
                                            validate: (value) =>
                                                value.length > 0 ||
                                                "At least one category is required",
                                        })}
                                    />
                                    {errors.categories && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.categories.message}
                                        </p>
                                    )}
                                </div>
                                {/* Tags */}
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                                        Tags *
                                    </h3>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Add a tag..."
                                            value={newTag}
                                            onChange={(e) =>
                                                setNewTag(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(),
                                                handleAddTag())
                                            }
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {watchedTags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    {/* Custom validation for tags */}
                                    <input
                                        type="hidden"
                                        {...register("tags", {
                                            validate: (value) =>
                                                value.length > 0 ||
                                                "At least one tag is required",
                                        })}
                                    />
                                    {errors.tags && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.tags.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <PrivacySettings
                            privacy={watchedPrivacy}
                            onPrivacyChange={handlePrivacyChange}
                        />

                        {/* Group Image */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaCamera className="mr-2 text-blue-500" />
                                Group Image
                            </h3>
                            <div>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile Preview"
                                            className="w-24 h-24 object-cover mx-auto rounded-full"
                                        />
                                    ) : (
                                        <div className="text-gray-600">
                                            <FaCamera
                                                className="mx-auto mb-2"
                                                size={24}
                                            />
                                            Add Group Photo
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </section>

                        <InviteMembers
                            invitedMembers={members}
                            onInviteMember={handleInviteMember}
                            onRemoveInvite={handleRemoveInvite}
                        />

                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate("/app/social/groups")}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? "Creating..." : "Create Group"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupPage;
