import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaGlobe, FaLock, FaPlus } from "react-icons/fa";
import { groupService } from "@/services/api/group/group.service";
import { useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";
import { groupCategories as categories } from "../../group.constants";

const GroupEditModal = ({ isOpen, onClose, group, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        privacy: "public",
        categories: [],
        tags: [],
    });
    const [profileImage, setprofileImage] = useState(null); // Stores Base64 string
    const [profileImagePreview, setprofileImagePreview] = useState(null);
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // Initialize form data when group changes
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || "",
                description: group.description || "",
                privacy: group.privacy || "public",
                categories: group.category || [],
                tags: group.tags || [],
            });
            setprofileImage(null);
            setprofileImagePreview(group.profileImage || null);
        }
    }, [group]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    // Handle category toggle
    const handleCategoryToggle = (category) => {
        setFormData((prev) => {
            const currentCategories = prev.categories || [];
            if (currentCategories.includes(category)) {
                return {
                    ...prev,
                    categories: currentCategories.filter(
                        (cat) => cat !== category
                    ),
                };
            } else {
                return {
                    ...prev,
                    categories: [...currentCategories, category],
                };
            }
        });
        setError(null);
    };

    // Handle add tag
    const handleAddTag = () => {
        const currentTags = formData.tags || [];
        if (newTag.trim() && !currentTags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...currentTags, newTag.trim()],
            }));
            setNewTag("");
            setError(null);
        }
    };

    // Handle remove tag
    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
        }));
    };

    // Handle cover photo changes and convert to Base64
    const handleprofileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPEG or PNG images are allowed.");
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setprofileImage(reader.result); // Store Base64 string
                setprofileImagePreview(reader.result); // Use Base64 for preview
                setError(null);
            };
            reader.onerror = () => {
                setError("Failed to read the image file.");
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation
        if (!formData.name?.trim()) {
            setError("Group name is required");
            setIsLoading(false);
            return;
        }

        if (!formData.categories || formData.categories.length === 0) {
            setError("At least one category is required");
            setIsLoading(false);
            return;
        }

        if (!formData.tags || formData.tags.length === 0) {
            setError("At least one tag is required");
            setIsLoading(false);
            return;
        }

        try {
            // Prepare JSON payload
            const payload = {
                name: formData.name,
                description: formData.description,
                privacy: formData.privacy,
                category: formData.categories,
                tags: formData.tags,
                profileImage: profileImage || undefined, // Send Base64 string or undefined
            };
            console.log("Payload to update group:", payload);
            const response = await groupService.updateGroup(group.id, payload);

            // Dispatch success notification
            Utils.dispatchNotification(
                response.data?.message || "Group updated successfully",
                "success",
                dispatch
            );

            onSave(response);
            onClose();
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to update group. Please try again.";
            setError(errorMessage);

            // Dispatch error notification
            Utils.dispatchNotification(errorMessage, "error", dispatch);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        if (
            profileImagePreview &&
            !profileImagePreview.startsWith("data:image")
        ) {
            URL.revokeObjectURL(profileImagePreview); // Clean up only if preview is a URL
        }
        setprofileImage(null);
        setprofileImagePreview(null);
        setNewTag("");
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit Group
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close modal"
                        disabled={isLoading}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Cover Photo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Photo
                        </label>
                        <div
                            className="relative h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                                document
                                    .getElementById("profileImageInput")
                                    .click()
                            }
                        >
                            {profileImagePreview ? (
                                <img
                                    src={profileImagePreview}
                                    alt="Cover Preview"
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-center">
                                    <FaCamera className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Click to upload cover photo
                                    </p>
                                </div>
                            )}
                            <input
                                id="profileImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleprofileImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Group Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Group Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter group name"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe what your group is about..."
                            disabled={isLoading}
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        checked={(
                                            formData.categories || []
                                        ).includes(category)}
                                        onChange={() =>
                                            handleCategoryToggle(category)
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-gray-700">
                                        {category}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {formData.categories &&
                            formData.categories.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected categories:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.categories.map((category) => (
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
                                                    disabled={isLoading}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags *
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add a tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(formData.tags || []).map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-blue-600 hover:text-blue-800"
                                        disabled={isLoading}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Privacy */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Group Privacy
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    id="public"
                                    name="privacy"
                                    value="public"
                                    checked={formData.privacy === "public"}
                                    onChange={handleInputChange}
                                    className="mt-1 mr-3"
                                    disabled={isLoading}
                                />
                                <div>
                                    <label
                                        htmlFor="public"
                                        className="flex items-center font-medium text-gray-900"
                                    >
                                        <FaGlobe className="mr-2 text-blue-500" />
                                        Public
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        Anyone can see the group and its members
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    id="private"
                                    name="privacy"
                                    value="private"
                                    checked={formData.privacy === "private"}
                                    onChange={handleInputChange}
                                    className="mt-1 mr-3"
                                    disabled={isLoading}
                                />
                                <div>
                                    <label
                                        htmlFor="private"
                                        className="flex items-center font-medium text-gray-900"
                                    >
                                        <FaLock className="mr-2 text-gray-500" />
                                        Private
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        Only members can see the group and its
                                        content
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

GroupEditModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    group: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        profileImage: PropTypes.string,
        privacy: PropTypes.string,
        category: PropTypes.array,
        tags: PropTypes.array,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default GroupEditModal;
