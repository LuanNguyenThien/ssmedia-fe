import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import MemberOptions from "../MemberOptions";
import { groupService } from "@/services/api/group/group.service";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "@services/utils/utils.service";
export default function MembersTab({ group, canViewContent }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isGroupAdmin = true;
  const currentUserRole = "admin";
  const dispatch = useDispatch();
  const [activeMembers, setActiveMembers] = useState([]);

  // Thêm useEffect để cập nhật activeMembers khi group.members thay đổi
  useEffect(() => {
    if (group && group.members) {
      const filteredMembers = group.members.filter(
        (member) => member.status === "active"
      );
      setActiveMembers(filteredMembers);
    }
  }, [group]);

  useEffect(() => {
    if (canViewContent) {
      // Mock API call to fetch group members
      setTimeout(() => {
        setMembers([
          { id: "1", name: "John Doe", role: "admin", avatar: null },
          {
            id: "2",
            name: "Jane Smith",
            role: "moderator",
            avatar: null,
          },
          {
            id: "3",
            name: "David Wilson",
            role: "member",
            avatar: null,
          },
          {
            id: "4",
            name: "Sarah Johnson",
            role: "member",
            avatar: null,
          },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [canViewContent]);

  if (!canViewContent) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Member list is protected
        </h3>
        <p className="text-gray-600">
          You need to join the group to see the member list.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">
          Members ({(group.members?.length || 0).toLocaleString()})
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-skeleton-animation"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mt-2 animate-skeleton-animation"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Handler functions
  const handleRemoveMember = async (member) => {
    try {
      const members = [member.userId];
      console.log("Removing member:", members);
      const groupId = group._id;
      console.log("Group ID:", groupId);
      console.log(activeMembers, "haha");
      const response = await groupService.removeMember(groupId, members);
      
      console.log("Member removed successfully:", response);
      
      setActiveMembers((prev) => prev.filter((m) => m.userId !== member.userId));
      Utils.dispatchNotification(
        response.data?.message || "Member removed successfully",
        "success",
        dispatch
      );
    } catch (err) {
      console.error("Error removing member:", err);
      Utils.dispatchNotification(
        err.response?.data?.message || "Failed to remove member",
        "error",
        dispatch
      );
    }
  };

  const handleReportMember = (member) => {
    console.log("Reporting member:", member);
    // Add your report logic here
    // Could open a report modal
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">
        Members {activeMembers.length.toLocaleString()}
      </h3>
      <div className="space-y-3">
        {group.members
          .filter((member) => member.status === "active")
          .map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={`${member.username || member.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {(member.username || member.name).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-grow">
                <h4 className="font-medium text-gray-800">{member.username}</h4>
                <p className="text-sm text-gray-500 capitalize">
                  {member.role}
                </p>
              </div>
              <MemberOptions
                member={member}
                isGroupAdmin={isGroupAdmin}
                currentUserRole={currentUserRole}
                onRemoveMember={handleRemoveMember}
                onReportMember={handleReportMember}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
