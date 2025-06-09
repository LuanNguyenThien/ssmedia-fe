import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaGlobe, FaLock } from "react-icons/fa";

const GroupEditModal = ({ isOpen, onClose, group, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        visibility: "public",
        whoCanJoin: "anyone",
        whoCanPost: "members",
    });

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || "",
                description: group.description || "",
                visibility: group.visibility || "public",
                whoCanJoin: group.privacy?.whoCanJoin || "anyone",
                whoCanPost: group.privacy?.whoCanPost || "members",
            });
        }
    }, [group]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Edit Group</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close modal"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Cover Photo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Photo
                        </label>
                        <div className="relative h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                            <div className="text-center">
                                <FaCamera className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">
                                    Click to upload cover photo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Group Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Group Visibility
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    id="public"
                                    name="visibility"
                                    value="public"
                                    checked={formData.visibility === "public"}
                                    onChange={handleInputChange}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <label htmlFor="public" className="flex items-center font-medium text-gray-900">
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
                                    name="visibility"
                                    value="private"
                                    checked={formData.visibility === "private"}
                                    onChange={handleInputChange}
                                    className="mt-1 mr-3"
                                />
                                <div>
                                    <label htmlFor="private" className="flex items-center font-medium text-gray-900">
                                        <FaLock className="mr-2 text-gray-500" />
                                        Private
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        Only members can see the group and its content
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who Can Join */}
                    <div>
                        <label htmlFor="whoCanJoin" className="block text-sm font-medium text-gray-700 mb-2">
                            Who can join this group?
                        </label>
                        <select
                            id="whoCanJoin"
                            name="whoCanJoin"
                            value={formData.whoCanJoin}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="anyone">Anyone</option>
                            <option value="approval">Anyone (with approval)</option>
                            <option value="invite">Invite only</option>
                        </select>
                    </div>

                    {/* Who Can Post */}
                    <div>
                        <label htmlFor="whoCanPost" className="block text-sm font-medium text-gray-700 mb-2">
                            Who can post in this group?
                        </label>
                        <select
                            id="whoCanPost"
                            name="whoCanPost"
                            value={formData.whoCanPost}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="members">All members</option>
                            <option value="admins">Admins only</option>
                            <option value="admins_moderators">Admins and moderators</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                        >
                            Save Changes
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
    group: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default GroupEditModal; 