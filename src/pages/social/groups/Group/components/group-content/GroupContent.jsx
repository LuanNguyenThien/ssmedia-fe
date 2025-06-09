import PropTypes from "prop-types";
import DiscussionTab from "./components/DiscussionTab";
import MembersTab from "./components/MembersTab";
import MediaTab from "./components/MediaTab";
import AboutTab from "./components/AboutTab";
import ApprovalTab from "./components/ApprovalTab";

const GroupContent = ({ group, activeTab, canViewContent, onJoinGroup, membershipStatus }) => {
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
                    <MembersTab group={group} canViewContent={canViewContent} />
                );
            case "approvals":
                return (
                    <ApprovalTab 
                        group={group} 
                        canViewContent={canViewContent} 
                        isGroupAdmin={isGroupAdmin}
                    />
                );
            case "media":
                return <MediaTab canViewContent={canViewContent} />;
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

MediaTab.propTypes = {
    canViewContent: PropTypes.bool.isRequired,
};

AboutTab.propTypes = {
    group: PropTypes.object.isRequired,
};

export default GroupContent;
