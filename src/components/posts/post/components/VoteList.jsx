import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const VoteList = ({ list, maxHeight = 400, onClose }) => {
    const [displayedItems, setDisplayedItems] = useState(5);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);
    const containerRef = useRef(null);

    const loadMoreItems = useCallback(() => {
        if (loading || displayedItems >= list.length) return;

        setLoading(true);
        // Simulate loading delay with debounce
        const timer = setTimeout(() => {
            setDisplayedItems((prev) => Math.min(prev + 5, list.length));
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [loading, displayedItems, list.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreItems();
                }
            },
            { threshold: 0.5 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loadMoreItems]);

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
                            Voters
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
                className="bg-white rounded-lg p-4 w-full max-w-md"
            >
                <div className="vote-list-header">
                    <h3 className="text-lg font-medium text-gray-700 mb-3 px-2">
                        Voters
                    </h3>
                </div>
                <div
                    ref={containerRef}
                    className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    style={{ maxHeight: `${maxHeight}px` }}
                >
                    {list.slice(0, displayedItems).map((voter) => (
                        <div
                            key={voter._id}
                            className="cursor-pointer flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    {voter.profilePicture ? (
                                        <img
                                            src={voter.profilePicture}
                                            alt={voter.username}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                                            style={{
                                                backgroundColor:
                                                    voter.avatarColor ||
                                                    "#6B7280",
                                            }}
                                        >
                                            {voter.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="ml-3">
                                    <p className="font-medium text-gray-800">
                                        {voter.username}
                                    </p>
                                </div>
                            </div>

                            <div>
                                {voter.type === "upvote" ? (
                                    <span className="text-green-500">
                                        <FaChevronUp size={16} />
                                    </span>
                                ) : (
                                    <span className="text-red-500">
                                        <FaChevronDown size={16} />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {displayedItems < list.length && (
                        <div
                            ref={observerRef}
                            className="flex justify-center items-center p-3"
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin text-gray-400" />
                            ) : (
                                <button
                                    onClick={loadMoreItems}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Load more
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

VoteList.propTypes = {
    list: PropTypes.array.isRequired,
    maxHeight: PropTypes.number,
};

export default VoteList;
