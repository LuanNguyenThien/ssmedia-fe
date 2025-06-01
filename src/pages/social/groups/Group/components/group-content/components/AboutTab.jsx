export default function AboutTab({ group }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">About {group.name}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                        Description
                    </h4>
                    <p className="text-gray-700">{group.description}</p>
                </div>

                <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                        General Information
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                        <li>
                            <span className="font-medium">Category:</span>{" "}
                            {group.category}
                        </li>
                        <li>
                            <span className="font-medium">Location:</span>{" "}
                            {group.location}
                        </li>
                        <li>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                        </li>
                        <li>
                            <span className="font-medium">Group Type:</span>{" "}
                            {group.visibility === "public"
                                ? "Public"
                                : group.visibility === "private"
                                ? "Private"
                                : "Secret"}
                        </li>
                    </ul>
                </div>

                {group.tags && group.tags.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {group.statistics && (
                    <div>
                        <h4 className="font-medium text-gray-800 mb-2">
                            Statistics
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {group.statistics.totalPosts}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Posts
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {group.statistics.activeMembers}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Active Members
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
