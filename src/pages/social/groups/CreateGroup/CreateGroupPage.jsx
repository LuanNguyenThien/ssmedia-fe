
import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import Input from "@components/input/Input";
import { FaUsers, FaCamera, FaPlus } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { Utils } from "@services/utils/utils.service";
import PrivacySettings from "./components/PrivacySettings";
import InviteMembers from "./components/InviteMembers";
import { imageService } from "@services/api/image/image.service";
import { groupService } from "@services/api/group/group.service";
import GroupChatUtils from "@/services/utils/group-chat-utils.service";
import { useDispatch, useSelector } from "react-redux";
// Categories for groups
const categories = [
  "Technology",
  "Business",
  "Education",
  "Entertainment",
  "Sports",
  "Health & Fitness",
  "Travel",
  "Food & Cooking",
  "Art & Design",
  "Music",
  "Photography",
  "Gaming",
  "Science",
  "Politics",
  "Lifestyle",
  "DIY & Crafts",
  "Parenting",
  "Books",
  "Movies & TV",
  "Fashion",
  "Finance",
  "Real Estate",
  "Marketing",
  "Other",
];

const CreateGroupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  
  // Form state for group creation
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    privacy: "public",
    members: [],
    tags: [],
    category: "",
    profileImage: null,
  });

  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (privacy) => {
    setGroupData((prev) => ({
      ...prev,
      privacy,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !groupData.tags.includes(newTag.trim())) {
      setGroupData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setGroupData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle file selection for group avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupData((prev) => ({ ...prev, profileImage: file }));
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
    if (!groupData.profileImage) return null;

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const response = await imageService.addImage(
              "/images/group-avatar",
              event.target.result
            );
            setUploadedImageUrl(response.data.imageUrl);
            resolve(response.data);
          } catch (error) {
            console.error("Error uploading group avatar:", error);
            Utils.dispatchNotification(
              error.response?.data?.message || "Error uploading image",
              "error",
              dispatch
            );
            reject(error);
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(groupData.profileImage);
      });
    } catch (error) {
      console.error("Error preparing image for upload:", error);
      return null;
    }
  };

  const handleInviteMember = (member) => {
    
    setGroupData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
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
      ],
    }));
  };

  const handleRemoveInvite = (memberId) => {
    setGroupData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.userId !== memberId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!groupData.name.trim()) {
      newErrors.name = "Group name is required";
    }

    if (!groupData.description.trim()) {
      newErrors.description = "Group description is required";
    }

    if (!groupData.category) {
      newErrors.category = "Please select a category";
    }

    if (groupData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    if (groupData.members.length === 0) {
      newErrors.members = "At least one member must be invited";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) {
    //   return;
    // }

    setLoading(true);

    try {
      // Upload image
      let imageData = null;
      if (groupData.profileImage) {
        imageData = await uploadGroupAvatar();
      }
    //   console.log("Image data:", imageData.url);
      // Chuẩn bị dữ liệu cho API
      const groupPayload = {
        name: groupData.name,
        description: groupData.description,
        privacy: groupData.privacy,
        members: groupData.members,
        tags: groupData.tags,
        category: [groupData.category],
        profileImage: imageData ? imageData.url : "",
      };

      console.log("Group Payload:", groupPayload);
      // Gọi API qua groupService
      const response = await groupService.createGroup(groupPayload);

      Utils.dispatchNotification(
        "Group created successfully!",
        "success",
        dispatch
      );

      // Emit sự kiện nhóm
      GroupChatUtils.emitGroupAction("CREATE_GROUP", {
        groupId: response.data.group._id,
        groupName: response.data.group.name,
        groupPicture: response.data.group.profileImage,
        members: response.data.group.members,
      });
     
      // Chuyển hướng
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
    <div className="bg-background-blur h-[90vh] w-full col-span-full max-h-screen overflow-scroll rounded-t-3xl p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create New Group
            </h1>
            <p className="text-gray-600">
              Build a community around your interests and connect with
              like-minded people.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    name="name"
                    labelText="Group Name *"
                    placeholder="Enter group name"
                    value={groupData.name}
                    handleChange={handleInputChange}
                    className={
                      errors.name ? "border-red-500" : "border rounded-lg"
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe what your group is about..."
                    value={groupData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={groupData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Group Image */}
            <section>
              <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
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
                      <FaCamera className="mx-auto mb-2" size={24} />
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

            {/* Tags */}
            <section>
              <h3 className="text-md font-semibold text-gray-800 mb-3">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
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
                {groupData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </section>

            <PrivacySettings
              privacy={groupData.privacy}
              onPrivacyChange={handlePrivacyChange}
            />

            <InviteMembers
              invitedMembers={groupData.members}
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