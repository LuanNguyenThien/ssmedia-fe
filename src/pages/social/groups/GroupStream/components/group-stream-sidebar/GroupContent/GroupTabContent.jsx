import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa";
import PropTypes from "prop-types";
import GroupCard from "./GroupCard";

const GroupTabContent = ({
    activeTab,
    groups,
    searchTerm,
    filterCategory,
    userId,
    onJoinGroup,
    onAcceptInvitation,
    onDeclineInvitation,
}) => {
    const navigate = useNavigate();
    const [displayCount, setDisplayCount] = useState(5);

    const INITIAL_DISPLAY_COUNT = 5;
    const LOAD_MORE_COUNT = 10; // Load 10 more items each time
    const MAX_INCREMENTAL_LOAD = 50; // After 50 items, show "Show All" option

    const getGroupType = () => {
        switch (activeTab) {
            case "joined":
                return "joined";
            case "explore":
                return "explore";
            case "invitations":
                return "invitation";
            default:
                return "joined";
        }
    };

    // Apply filters with useMemo for performance optimization
    const filteredGroups = useMemo(() => {
        let result = groups;

        if (searchTerm) {
            result = result.filter(
                (group) =>
                    group.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    group.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== "all") {
            result = result.filter((group) =>
                group.category.includes(filterCategory)
            );
        }

        return result;
    }, [groups, searchTerm, filterCategory]);

    // Reset display count when filters change
    const displayedGroups = useMemo(() => {
        const count = Math.min(displayCount, filteredGroups.length);
        return filteredGroups.slice(0, count);
    }, [filteredGroups, displayCount]);

    // Reset display count when filters change
    useState(() => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
    }, [searchTerm, filterCategory]);

    const totalGroups = filteredGroups.length;
    const hasMoreItems = displayCount < totalGroups;
    const remainingItems = totalGroups - displayCount;
    const canLoadMore = displayCount < MAX_INCREMENTAL_LOAD && hasMoreItems;
    const shouldShowAllOption =
        displayCount >= MAX_INCREMENTAL_LOAD && hasMoreItems;

    const handleLoadMore = () => {
        const newCount = Math.min(displayCount + LOAD_MORE_COUNT, totalGroups);
        setDisplayCount(newCount);
    };

    const handleShowAll = () => {
        setDisplayCount(totalGroups);
    };

    const handleShowLess = () => {
        setDisplayCount(INITIAL_DISPLAY_COUNT);
        // Smooth scroll to top of the list
        setTimeout(() => {
            const element = document.querySelector("[data-group-list]");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const handleKeyDown = (event, action) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            action();
        }
    };

    const getEmptyStateContent = () => {
        const titles = {
            joined: "No groups joined yet",
            explore: "No groups found",
            invitations: "No pending invitations",
        };

        const descriptions = {
            joined: "Start by exploring groups",
            explore: "Try different filters",
            invitations: "Invitations will appear here",
        };

        const buttonLabels = {
            joined: "Explore Groups",
            explore: "Create Group",
            invitations: null,
        };

        const buttonActions = {
            joined: () => navigate("/app/social/groups"),
            explore: () => navigate("/app/social/create-group"),
            invitations: null,
        };

        return {
            title: titles[activeTab],
            description: descriptions[activeTab],
            buttonLabel: buttonLabels[activeTab],
            buttonAction: buttonActions[activeTab],
        };
    };

    if (totalGroups === 0) {
        const emptyState = getEmptyStateContent();

        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUsers className="text-gray-400" size={20} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    {emptyState.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                    {emptyState.description}
                </p>
                {emptyState.buttonLabel && emptyState.buttonAction && (
                    <button
                        onClick={emptyState.buttonAction}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs"
                    >
                        {emptyState.buttonLabel}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Progress indicator for large lists */}
            {totalGroups > 20 && (
                <div className="text-xs text-gray-500 mb-2 px-1">
                    Showing {displayedGroups.length} of {totalGroups} groups
                </div>
            )}

            <div data-group-list className="space-y-3">
                {displayedGroups.map((group) => (
                    <GroupCard
                        key={group.id}
                        group={group}
                        type={getGroupType()}
                        userId={userId}
                        onJoinGroup={onJoinGroup}
                        onAcceptInvitation={onAcceptInvitation}
                        onDeclineInvitation={onDeclineInvitation}
                    />
                ))}
            </div>

            {/* Load More / Show All / Show Less Controls */}
            {hasMoreItems && (
                <div className="flex flex-col items-center gap-2 pt-3 border-t border-gray-100">
                    {canLoadMore && (
                        <button
                            onClick={handleLoadMore}
                            onKeyDown={(e) => handleKeyDown(e, handleLoadMore)}
                            tabIndex={0}
                            aria-label={`Load ${Math.min(
                                LOAD_MORE_COUNT,
                                remainingItems
                            )} more groups`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span>
                                Load More (
                                {Math.min(LOAD_MORE_COUNT, remainingItems)})
                            </span>
                            <FaChevronDown size={12} />
                        </button>
                    )}

                    {shouldShowAllOption && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleShowAll}
                                onKeyDown={(e) =>
                                    handleKeyDown(e, handleShowAll)
                                }
                                tabIndex={0}
                                aria-label={`Show all ${remainingItems} remaining groups`}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            >
                                <span>Show All ({remainingItems})</span>
                                <FaChevronDown size={10} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Show Less button when many items are displayed */}
            {displayCount > INITIAL_DISPLAY_COUNT && (
                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleShowLess}
                        onKeyDown={(e) => handleKeyDown(e, handleShowLess)}
                        tabIndex={0}
                        aria-label="Show less groups and scroll to top"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                        <span>Show Less</span>
                        <FaChevronUp size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

GroupTabContent.propTypes = {
    activeTab: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    searchTerm: PropTypes.string.isRequired,
    filterCategory: PropTypes.string.isRequired,
    userId: PropTypes.string,
    onJoinGroup: PropTypes.func.isRequired,
    onAcceptInvitation: PropTypes.func.isRequired,
    onDeclineInvitation: PropTypes.func.isRequired,
};

export default GroupTabContent;
