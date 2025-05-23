import PropTypes from "prop-types";
import { FaLock, FaClock } from "react-icons/fa";

const AccessDenied = ({ group, onJoinGroup, membershipStatus }) => {
    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-6">
            <div className="max-w-2xl mx-auto text-center py-12 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaLock className="text-gray-400 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    This is a private group
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                    You need to be a member to see the content and activity in this group.
                </p>

                {membershipStatus === "pending" ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <FaClock className="text-yellow-600 text-xl mr-2" />
                            <h3 className="text-lg font-medium text-yellow-800">
                                Membership pending
                            </h3>
                        </div>
                        <p className="text-yellow-700">
                            Your request to join this group is waiting for admin approval.
                            You'll be notified when a decision is made.
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={onJoinGroup}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        {group.privacy.whoCanJoin === "anyone" ? "Join Group" : "Request to Join"}
                    </button>
                )}

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        About {group.name}
                    </h3>
                    <div className="text-gray-600">
                        <p className="mb-2">{group.description}</p>
                        <p className="text-sm">
                            <span className="font-medium">Category:</span> {group.category}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Created:</span> {new Date(group.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

AccessDenied.propTypes = {
    group: PropTypes.object.isRequired,
    onJoinGroup: PropTypes.func.isRequired,
    membershipStatus: PropTypes.string.isRequired,
};

export default AccessDenied; 