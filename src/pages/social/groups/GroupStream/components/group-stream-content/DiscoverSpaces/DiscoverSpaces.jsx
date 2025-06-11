import { useNavigate } from "react-router-dom";
import SpaceCard from "./SpaceCard";
import PropTypes from "prop-types";
import { FaArrowCircleRight } from "react-icons/fa";

const DiscoverSpaces = ({ exploreGroups, onJoinGroup, joinedGroups }) => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full overflow-y-auto bg-gray-50 rounded-md">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6 text-primary-black">
                    <h1 className="text-2xl font-bold">Discover Spaces</h1>
                    <p className="text-gray-500 text-lg">
                        Spaces you might like
                    </p>
                </div>

                {/* Featured Spaces Grid */}
                {exploreGroups.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-8">
                        {exploreGroups.map((space) => (
                            <SpaceCard
                                key={space.id}
                                space={space}
                                onClick={() => onJoinGroup(space.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Recent Groups Section */}
                {joinedGroups.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-primary-black mb-4">
                            Recent Groups
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {joinedGroups.slice(0, 6).map((group) => (
                                <div
                                    key={group.id}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() =>
                                        navigate(
                                            `/app/social/group/${group.id}`
                                        )
                                    }
                                >
                                    <div className="flex h-full items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
                                            {group.profileImage ? (
                                                <img
                                                    src={group.profileImage}
                                                    alt={`${group.name} group`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {group.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                                                {group.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                {group.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {(
                                                        group.members?.length ||
                                                        0
                                                    ).toLocaleString()}{" "}
                                                    members
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-full flex-shrink flex items-center justify-center">
                                            <span
                                                title="Move to this group"
                                            className="size-5 text-gray-500 hover:text-primary">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

DiscoverSpaces.propTypes = {
    exploreGroups: PropTypes.array.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    joinedGroups: PropTypes.array.isRequired,
};

export default DiscoverSpaces;
