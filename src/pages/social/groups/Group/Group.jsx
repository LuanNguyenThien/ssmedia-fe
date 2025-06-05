import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GroupHeader from "./components/group-header/GroupHeader";
import GroupTabs from "./components/group-header/GroupTabs";
import GroupSidebar from "./components/group-header/GroupSidebar";
import GroupContent from "./components/group-content/GroupContent";
import AccessDenied from "./components/errors/AccessDenied";
import NotFound from "./components/errors/NotFound";
import { Utils } from "@services/utils/utils.service";
import GroupSkeleton from "./GroupSkeleton";
import {
    mockGroupsInformation,
} from "../mocks/mock.data";
import GroupActionButtons from "./components/group-header/GroupActionButtons";
import useIsMobile from "@hooks/useIsMobile";
import GroupEditModal from "./components/GroupEditModal";
import { groupService } from "@services/api/group/group.service";
// import { g } from "react-router/dist/development/fog-of-war-D4x86-Xc";
const Group = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState("admin"); // not_member, pending, member, admin, moderator, banned
  const [activeTab, setActiveTab] = useState("discussion");
  const [canViewContent, setCanViewContent] = useState(false);
  const [error, setError] = useState(null);
  const [isShowEditGroup, setIsShowEditGroup] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(3); // Mock count - replace with API call
  const { profile } = useSelector((state) => state.user);
  const userId = profile?._id;
  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    determineContentAccess();
  }, [group, membershipStatus]);

  useEffect(() => {
    // Fetch pending requests count if user is admin
    if (membershipStatus === "admin") {
      // Simulate API call to get pending requests count
      const fetchPendingCount = async () => {
        // Mock API call - replace with actual API
        setPendingRequestsCount(3);
      };
      fetchPendingCount();
    } else {
      setPendingRequestsCount(0);
    }
  }, [membershipStatus]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Fetching group data for ID:", groupId);
      const group = await groupService.getGroupByGroupId(groupId);
      const groupData = group.data.group;
      const isMember = groupData.members.some(
        (member) => member.userId === userId && member.status === "active"
      );
      if(!isMember) {
        setMembershipStatus("not_member");}
      console.log("Group Data:", groupData);

      // const userMembershipStatus =
      //     mockMembershipStatus[groupId] || "not_member";

      if (!groupData) {
        setError("not_found");
        return;
      }

      // Check if user can see this group
      if (
        groupData.visibility === "secret" &&
        membershipStatus === "not_member"
      ) {
        setError("not_found");
        return;
      }

      setGroup(groupData);
      // setMembershipStatus(userMembershipStatus);
    } catch (err) {
      console.error("Error fetching group:", err);
      setError("server_error");
    } finally {
      setLoading(false);
    }
  };

  const determineContentAccess = () => {
    if (!group) return;

    // Determine if user can view group content
    let canView = false;

    switch (group.privacy) {
      case "public":
        // Public groups: everyone can see basic info, members can see full content
        canView =
          membershipStatus === "member" ||
          membershipStatus === "admin" ||
          membershipStatus === "moderator";
        break;
      case "private":
        // Private groups: only members can see content
        canView =
          membershipStatus === "member" ||
          membershipStatus === "admin" ||
          membershipStatus === "moderator";
        break;
    }

    setCanViewContent(canView);
  };

  const handleJoinGroup = async () => {
    try {
      // Simulate API call
      if (group.privacy.whoCanJoin === "anyone") {
        setMembershipStatus("member");
        Utils.dispatchNotification(
          "You have joined the group!",
          "success",
          dispatch
        );
      } else {
        setMembershipStatus("pending");
        Utils.dispatchNotification(
          "Join request sent! Waiting for approval.",
          "info",
          dispatch
        );
      }
    } catch (err) {
      console.error("Failed to join group:", err);
      Utils.dispatchNotification("Failed to join group", "error", dispatch);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      // Simulate API call
      const response = await groupService.leaveGroup(groupId);
      setMembershipStatus("not_member");
      Utils.dispatchNotification("You have left the group", "info", dispatch);
    } catch (err) {
      console.error("Failed to leave group:", err);
      Utils.dispatchNotification("Failed to leave group", "error", dispatch);
    }
  };

  const handleCancelRequest = async () => {
    try {
      // Simulate API call
      setMembershipStatus("not_member");
      Utils.dispatchNotification("Join request cancelled", "info", dispatch);
    } catch (err) {
      console.error("Failed to cancel request:", err);
      Utils.dispatchNotification("Failed to cancel request", "error", dispatch);
    }
  };

  if (loading) {
    return <GroupSkeleton />;
  }

  if (error === "not_found") {
    return <NotFound />;
  }

  if (error === "server_error") {
    return (
      <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Server Error
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load group information. Please try again later.
          </p>
          <button
            onClick={() => fetchGroupData()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return <NotFound />;
  }

  // Show access denied for private groups when user is not a member
  if (
    group.visibility === "private" &&
    !canViewContent &&
    membershipStatus === "not_member"
  ) {
    return (
      <AccessDenied
        group={group}
        onJoinGroup={handleJoinGroup}
        membershipStatus={membershipStatus}
      />
    );
  }

  return (
    <>
      {isShowEditGroup && (
        <GroupEditModal
          isOpen={isShowEditGroup}
          onClose={() => setIsShowEditGroup(false)}
          group={group}
          onSave={() => fetchGroupData()}
        />
      )}
      <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl max-h-screen overflow-y-auto">
        <div className="relative sm:px-4 lg:px-[10%]">
          {/* Cover Image */}
          <div className="h-72 bg-gradient-to-r from-blue-400 to-purple-500 relative">
            {group.profileImage ? (
              <img
                src={group.profileImage}
                alt="Group cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>

          {/* Group Header */}
          <GroupHeader
            group={group}
            groupId={groupId}
            membershipStatus={membershipStatus}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
            onCancelRequest={handleCancelRequest}
            setIsShowEditGroup={setIsShowEditGroup}
          />

          <div className="flex justify-between items-center bg-primary-white px-4 rounded-b-3xl">
            {/* Navigation Tabs */}
            <GroupTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              membershipStatus={membershipStatus}
              setIsShowEditGroup={setIsShowEditGroup}
              pendingRequestsCount={pendingRequestsCount}
            />
            {!isMobile && (
              <GroupActionButtons
                group={group}
                groupId={groupId}
                membershipStatus={membershipStatus}
                onJoinGroup={handleJoinGroup}
                onLeaveGroup={handleLeaveGroup}
                setIsShowEditGroup={setIsShowEditGroup}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-10 gap-6 pt-2 pb-auto">
            {/* Main Content Area */}
            <div className="col-span-full sm:col-span-7">
              <GroupContent
                group={group}
                activeTab={activeTab}
                canViewContent={canViewContent}
                onJoinGroup={handleJoinGroup}
                membershipStatus={membershipStatus}
              />
            </div>

            {/* Sidebar */}
            {!isMobile && (
              <div className="col-span-full sm:col-span-3">
                <GroupSidebar group={group} canViewContent={canViewContent} />
              </div>
            )}

            <div className="col-span-full sm:col-span-3 h-[14dvh] sm:h-[5vh]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
