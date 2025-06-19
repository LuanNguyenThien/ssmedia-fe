import { useState } from "react";
import DiscoverSpaces from "./DiscoverSpaces/DiscoverSpaces";
import PropTypes from "prop-types";

const GroupStreamContent = ({ 
    exploreGroups, 
    onJoinGroup ,
    joinedGroups
}) => {
    const [contentView] = useState("discover");

    const renderContent = () => {
        switch (contentView) {
            case "discover":
                return (
                    <DiscoverSpaces
                        exploreGroups={exploreGroups}
                        onJoinGroup={onJoinGroup}
                        joinedGroups={joinedGroups}
                    />
                );
            case "group-details":
                // Future: Individual group details view
                return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-2">
                                Group Details
                            </h2>
                            <p className="text-gray-300">
                                Select a group to view its details
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <DiscoverSpaces
                        exploreGroups={exploreGroups}
                        onJoinGroup={onJoinGroup}
                        joinedGroups={joinedGroups}
                    />
                );
        }
    };

    return (
        <div className="flex-1 h-full">
            {renderContent()}
        </div>
    );
};

GroupStreamContent.propTypes = {
    exploreGroups: PropTypes.array.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    joinedGroups: PropTypes.array.isRequired,
};

export default GroupStreamContent; 