import { useState, useEffect, useMemo } from "react";
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
import GroupActionButtons from "./components/group-header/GroupActionButtons";
import useIsMobile from "@hooks/useIsMobile";
import GroupEditModal from "./components/GroupEditModal";
import { groupService } from "@services/api/group/group.service";
import ImageModal from "@components/image-modal/ImageModal";

const Group = () => {
    const { profile } = useSelector((state) => state.user);
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [membershipStatus, setMembershipStatus] = useState("not_member"); // not_member, pending_user, pending_admin, member, admin, rejected, deleted
    const [activeTab, setActiveTab] = useState("discussion");
    const [canViewContent, setCanViewContent] = useState(false);
    const [error, setError] = useState(null);
    const [isShowEditGroup, setIsShowEditGroup] = useState(false);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const userId = profile?._id;

    // Get current user's membership info
    const currentMembership = useMemo(() => {
        return group?.members?.find((member) => member.userId === userId);
    }, [group, userId]);

    // Check if current user is admin
    const isAdmin = useMemo(() => {
        return currentMembership?.role === "admin" && currentMembership?.status === "active";
    }, [currentMembership]);

    const toggleImageModal = () => {
        setShowImageModal(!showImageModal);
    };

    const handleCoverImageClick = () => {
        if (group?.profileImage) {
            setImageUrl(group.profileImage);
            setShowImageModal(true);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    useEffect(() => {
        determineContentAccess();
    }, [group, membershipStatus]);

    useEffect(() => {
        // Fetch pending requests count if user is admin
        if (isAdmin) {
            const fetchPendingCount = async () => {
                try {
                    // Count pending_user and pending_admin requests
                    const pendingCount = group?.members?.filter(
                        (member) => member.status === "pending_user" || member.status === "pending_admin"
                    ).length || 0;
                    setPendingRequestsCount(pendingCount);
                } catch (error) {
                    console.error("Error fetching pending requests count:", error);
                    setPendingRequestsCount(0);
                }
            };
            fetchPendingCount();
        } else {
            setPendingRequestsCount(0);
        }
    }, [isAdmin, group]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await groupService.getGroupByGroupId(groupId);
            const groupData = response.data.group;

            if (!groupData) {
                setError("not_found");
                return;
            }

            setGroup(groupData);
            
            // Determine membership status based on new schema
            const userMembership = groupData.members?.find(
                (member) => member.userId === userId
            );

            let status = "not_member";
            
            if (userMembership) {
                switch (userMembership.status) {
                    case "active":
                        status = userMembership.role === "admin" ? "admin" : "member";
                        break;
                    case "pending_user":
                        status = "pending_user";
                        break;
                    case "pending_admin":
                        status = "pending_admin";
                        break;
                    case "rejected":
                        status = "rejected";
                        break;
                    case "deleted":
                        status = "deleted";
                        break;
                    default:
                        status = "not_member";
                }
            }

            setMembershipStatus(status);
        } catch (err) {
            console.error("Error fetching group:", err);
            setError("server_error");
        } finally {
            setLoading(false);
        }
    };

    const determineContentAccess = () => {
        if (!group) return;

        let canView = false;

        switch (group.privacy) {
            case "public":
                canView = true;
                break;
            case "private":
                canView = membershipStatus === "member" || membershipStatus === "admin";
                break;
        }

        setCanViewContent(canView);
    };

    const handleJoinGroup = async () => {
        try {
            const response = await groupService.joinGroup(groupId);
            
            // After joining, user status will be pending_user (waiting for admin approval)
            setMembershipStatus("pending_user");
            
            Utils.dispatchNotification(
                response.data?.message || "Join request sent successfully",
                "success",
                dispatch
            );
            
            // Refresh group data to get updated member list
            await fetchGroupData();
        } catch (error) {
            Utils.dispatchNotification(
                error.response?.data?.message || "Failed to send join request",
                "error",
                dispatch
            );
        }
    };

    const handleLeaveGroup = async () => {
        try {
            await groupService.leaveGroup(groupId);
            setMembershipStatus("not_member");
            
            Utils.dispatchNotification(
                "You have left the group",
                "info",
                dispatch
            );
            
            // Refresh group data to get updated member list
            await fetchGroupData();
        } catch (err) {
            console.error("Failed to leave group:", err);
            Utils.dispatchNotification(
                "Failed to leave group",
                "error",
                dispatch
            );
        }
    };

    const handleCancelRequest = async () => {
        try {
            // Cancel pending request (either pending_user or pending_admin)
            await groupService.cancelJoinRequest(groupId);
            setMembershipStatus("not_member");
            
            Utils.dispatchNotification(
                "Join request cancelled",
                "info",
                dispatch
            );
            
            // Refresh group data to get updated member list
            await fetchGroupData();
        } catch (err) {
            console.error("Failed to cancel request:", err);
            Utils.dispatchNotification(
                "Failed to cancel request",
                "error",
                dispatch
            );
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
                        Unable to load group information. Please try again
                        later.
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

    // Handle different access scenarios based on privacy and membership status
    const shouldShowAccessDenied = () => {
        if (group.privacy === "private") {
            // Private groups: only active members can access
            return !canViewContent && (
                membershipStatus === "not_member" || 
                membershipStatus === "rejected" || 
                membershipStatus === "deleted"
            );
        }
        return false;
    };

    if (shouldShowAccessDenied()) {
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
            {showImageModal && (
                <ImageModal
                    image={imageUrl}
                    onCancel={toggleImageModal}
                    showArrow={false}
                />
            )}
            
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
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                onClick={handleCoverImageClick}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>

                    {/* Group Header */}
                    <GroupHeader
                        isAdmin={isAdmin}
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
                                <GroupSidebar
                                    group={group}
                                    canViewContent={canViewContent}
                                />
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
