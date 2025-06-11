import PropTypes from "prop-types";
import DiscussionTab from "./components/DiscussionTab/DiscussionTab";
import MembersTab from "./components/MembersTab/MembersTab";
import AboutTab from "./components/AboutTab";
import ApprovalTab from "./components/MemberRequests/MemberRequests";
import PendingPosts from "./components/PendingPosts";

const GroupContent = ({
    group,
    activeTab,
    canViewContent,
    onJoinGroup,
    membershipStatus,
}) => {
    const isGroupAdmin = membershipStatus === "admin";

    // Render the appropriate tab content
    const renderContent = () => {
        switch (activeTab) {
            case "discussion":
                return (
                    <DiscussionTab
                        group={group}
                        canViewContent={canViewContent}
                        onJoinGroup={onJoinGroup}
                    />
                );
            case "members":
                return (
                    <MembersTab
                        isGroupAdmin={isGroupAdmin}
                        group={group}
                        canViewContent={canViewContent}
                    />
                );
            case "approvals-members":
                return (
                    <ApprovalTab
                        group={group}
                        canViewContent={canViewContent}
                        isGroupAdmin={isGroupAdmin}
                    />
                );
            case "approvals-posts":
                return (
                    <PendingPosts
                        group={group}
                        canViewContent={canViewContent}
                        onJoinGroup={onJoinGroup}
                    />
                );
            case "about":
                return <AboutTab group={group} />;
            default:
                return (
                    <DiscussionTab
                        group={group}
                        canViewContent={canViewContent}
                        onJoinGroup={onJoinGroup}
                    />
                );
        }
    };

    return <div>{renderContent()}</div>;
};

GroupContent.propTypes = {
    group: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
    canViewContent: PropTypes.bool.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    membershipStatus: PropTypes.string.isRequired,
};

DiscussionTab.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
};

MembersTab.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
};

ApprovalTab.propTypes = {
    group: PropTypes.object.isRequired,
    canViewContent: PropTypes.bool.isRequired,
    isGroupAdmin: PropTypes.bool.isRequired,
};
AboutTab.propTypes = {
    group: PropTypes.object.isRequired,
};

export default GroupContent;
