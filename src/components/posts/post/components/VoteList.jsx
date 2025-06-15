import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { icons } from "@/assets/assets";
import { DynamicSVG } from "@/components/sidebar/components/SidebarItems";
import { ProfileUtils } from "@/services/utils/profile-utils.service";
import { useNavigate } from "react-router-dom";

const VoteList = ({ list, maxHeight = 400, onClose }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("upvotes");
    const [upvoteDisplayed, setUpvoteDisplayed] = useState(5);
    const [downvoteDisplayed, setDownvoteDisplayed] = useState(5);
    const [loadingUpvotes, setLoadingUpvotes] = useState(false);
    const [loadingDownvotes, setLoadingDownvotes] = useState(false);
    const upvoteObserverRef = useRef(null);
    const downvoteObserverRef = useRef(null);

    // Filter votes by type
    const upvotes = list.filter((vote) => vote.type === "upvote");
    const downvotes = list.filter((vote) => vote.type === "downvote");

    const loadMoreUpvotes = useCallback(() => {
        if (loadingUpvotes || upvoteDisplayed >= upvotes.length) return;

        setLoadingUpvotes(true);
        const timer = setTimeout(() => {
            setUpvoteDisplayed((prev) => Math.min(prev + 5, upvotes.length));
            setLoadingUpvotes(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [loadingUpvotes, upvoteDisplayed, upvotes.length]);

    const loadMoreDownvotes = useCallback(() => {
        if (loadingDownvotes || downvoteDisplayed >= downvotes.length) return;

        setLoadingDownvotes(true);
        const timer = setTimeout(() => {
            setDownvoteDisplayed((prev) =>
                Math.min(prev + 5, downvotes.length)
            );
            setLoadingDownvotes(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [loadingDownvotes, downvoteDisplayed, downvotes.length]);

    useEffect(() => {
        const upvoteObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && activeTab === "upvotes") {
                    loadMoreUpvotes();
                }
            },
            { threshold: 0.5 }
        );

        const downvoteObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && activeTab === "downvotes") {
                    loadMoreDownvotes();
                }
            },
            { threshold: 0.5 }
        );

        if (upvoteObserverRef.current && activeTab === "upvotes") {
            upvoteObserver.observe(upvoteObserverRef.current);
        }

        if (downvoteObserverRef.current && activeTab === "downvotes") {
            downvoteObserver.observe(downvoteObserverRef.current);
        }

        return () => {
            if (upvoteObserverRef.current) {
                upvoteObserver.unobserve(upvoteObserverRef.current);
            }
            if (downvoteObserverRef.current) {
                downvoteObserver.unobserve(downvoteObserverRef.current);
            }
        };
    }, [loadMoreUpvotes, loadMoreDownvotes, activeTab]);

    const handleMoveToProfile = (data) => {
        ProfileUtils.navigateToProfile(
            {
                username: data.username,
                _id: data._id,
            },
            navigate
        );
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleKeyDown = (event, tab) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTabChange(tab);
        }
    };

    const renderVoterItem = (voter) => {
        console.log(voter);
        return (
            <div
                key={voter._id}
                className="cursor-pointer group flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                // onClick={() =>
                //     handleMoveToProfile({
                //         username: voter.username,
                //         _id: voter._id,
                //     })
                // }
            >
                <div className="flex items-center w-full">
                    <div className="relative w-8 h-8">
                        {voter.profilePicture ? (
                            <img
                                src={voter.profilePicture}
                                alt={voter.username}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs"
                                style={{
                                    backgroundColor:
                                        voter.avatarColor || "#6B7280",
                                }}
                            >
                                {voter.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="ml-2">
                        <p className="font-medium text-gray-800 text-sm">
                            {voter.username}
                        </p>
                    </div>

                    {/* <div className="hidden flex-1 justify-end items-center group-hover:flex ml-2 text-sm text-gray-500 gap-2">
                        <span className="text-xs text-gray-300">
                            Move to this user
                        </span>
                        <DynamicSVG
                            svgData={icons.chevron}
                            className="size-5 md:size-6 rotate-90"
                        />
                    </div> */}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (activeTab === "upvotes") {
            return (
                <div className="h-full">
                    {upvotes.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                            <div className="text-center">
                                <FaChevronUp
                                    className="mx-auto mb-2 text-gray-400"
                                    size={24}
                                />
                                No upvotes yet
                            </div>
                        </div>
                    ) : (
                        <div
                            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{ maxHeight: `${maxHeight - 80}px` }}
                        >
                            {upvotes
                                .slice(0, upvoteDisplayed)
                                .map(renderVoterItem)}

                            {upvoteDisplayed < upvotes.length && (
                                <div
                                    ref={upvoteObserverRef}
                                    className="flex justify-center items-center p-3"
                                >
                                    {loadingUpvotes ? (
                                        <FaSpinner className="animate-spin text-green-500" />
                                    ) : (
                                        <button
                                            onClick={loadMoreUpvotes}
                                            className="text-sm text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                            Load more (
                                            {upvotes.length - upvoteDisplayed})
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="h-full">
                {downvotes.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                        <div className="text-center">
                            <FaChevronDown
                                className="mx-auto mb-2 text-gray-400"
                                size={24}
                            />
                            No downvotes yet
                        </div>
                    </div>
                ) : (
                    <div
                        className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ maxHeight: `${maxHeight - 80}px` }}
                    >
                        {downvotes
                            .slice(0, downvoteDisplayed)
                            .map(renderVoterItem)}

                        {downvoteDisplayed < downvotes.length && (
                            <div
                                ref={downvoteObserverRef}
                                className="flex justify-center items-center p-3"
                            >
                                {loadingDownvotes ? (
                                    <FaSpinner className="animate-spin text-red-500" />
                                ) : (
                                    <button
                                        onClick={loadMoreDownvotes}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Load more (
                                        {downvotes.length - downvoteDisplayed})
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (!list || list.length === 0) {
        return (
            <div
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-lg p-4 w-full max-w-md"
                >
                    <div className="vote-list-header">
                        <h3 className="text-lg font-medium text-gray-700 mb-3 px-2">
                            Votes
                        </h3>
                    </div>
                    <div className="flex items-center justify-center p-4 text-gray-500">
                        No votes yet
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg w-full max-w-md"
            >
                {/* Tab Selector Header */}
                <div className="p-4 pb-0">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => handleTabChange("upvotes")}
                            onKeyDown={(e) => handleKeyDown(e, "upvotes")}
                            tabIndex={0}
                            aria-label={`View upvotes (${upvotes.length})`}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeTab === "upvotes"
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-gray-600 hover:text-green-600"
                            }`}
                        >
                            <FaChevronUp size={14} />
                            Upvotes ({upvotes.length})
                        </button>
                        <button
                            onClick={() => handleTabChange("downvotes")}
                            onKeyDown={(e) => handleKeyDown(e, "downvotes")}
                            tabIndex={0}
                            aria-label={`View downvotes (${downvotes.length})`}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeTab === "downvotes"
                                    ? "bg-white text-red-700 shadow-sm"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            <FaChevronDown size={14} />
                            Downvotes ({downvotes.length})
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4">{renderContent()}</div>
            </div>
        </div>
    );
};

VoteList.propTypes = {
    list: PropTypes.array.isRequired,
    maxHeight: PropTypes.number,
    onClose: PropTypes.func.isRequired,
};

export default VoteList;
