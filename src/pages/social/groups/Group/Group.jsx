import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import GroupHeader from "./components/GroupHeader";
import GroupTabs from "./components/GroupTabs";
import GroupSidebar from "./components/GroupSidebar";
import GroupContent from "./components/GroupContent";
import AccessDenied from "./components/AccessDenied";
import NotFound from "./components/NotFound";
import { Utils } from "@services/utils/utils.service";
import GroupSkeleton from "./GroupSkeleton";
import { mockGroupsInformation, mockMembershipStatus } from "../mocks/mock.data";

const Group = () => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [membershipStatus, setMembershipStatus] = useState("not_member"); // not_member, pending, member, admin, moderator, banned
    const [activeTab, setActiveTab] = useState("discussion");
    const [canViewContent, setCanViewContent] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    useEffect(() => {
        determineContentAccess();
    }, [group, membershipStatus]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const groupData = mockGroupsInformation[groupId];
            const userMembershipStatus =
                mockMembershipStatus[groupId] || "not_member";

            if (!groupData) {
                setError("not_found");
                return;
            }

            // Check if user can see this group
            if (
                groupData.visibility === "secret" &&
                userMembershipStatus === "not_member"
            ) {
                setError("not_found");
                return;
            }

            setGroup(groupData);
            setMembershipStatus(userMembershipStatus);
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

        switch (group.visibility) {
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
            case "secret":
                // Secret groups: only members can see anything
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
            Utils.dispatchNotification(
                "Failed to join group",
                "error",
                dispatch
            );
        }
    };

    const handleLeaveGroup = async () => {
        try {
            // Simulate API call
            setMembershipStatus("not_member");
            Utils.dispatchNotification(
                "You have left the group",
                "info",
                dispatch
            );
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
            // Simulate API call
            setMembershipStatus("not_member");
            Utils.dispatchNotification(
                "Join request cancelled",
                "info",
                dispatch
            );
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
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl max-h-screen overflow-y-auto">
            <div className="relative">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    {group.coverImage ? (
                        <img
                            src={group.coverImage}
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
                />

                {/* Navigation Tabs */}
                <GroupTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    membershipStatus={membershipStatus}
                />

                {/* Main Content */}
                <div className="grid grid-cols-10 gap-6 p-6">
                    {/* Main Content Area */}
                    <div className="col-span-7">
                        <GroupContent
                            group={group}
                            activeTab={activeTab}
                            canViewContent={canViewContent}
                            onJoinGroup={handleJoinGroup}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-3">
                        <GroupSidebar
                            group={group}
                            canViewContent={canViewContent}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group;
