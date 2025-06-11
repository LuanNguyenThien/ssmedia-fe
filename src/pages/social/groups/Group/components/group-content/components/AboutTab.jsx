export default function AboutTab({ group }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">About {group.name}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold underline text-gray-800 mb-2 ">
                        Description
                    </h4>
                    <p className="text-gray-700 h-auto line-clamp-5">
                        {group.description}
                    </p>
                </div>

                <div>
                    <h4 className="font-bold underline text-gray-800 mb-2">
                        General Information
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                        <li>
                            <span className="font-medium">Category:</span>{" "}
                            {group.category &&
                                group.category
                                    .map((category) => category)
                                    .join(", ")}
                        </li>

                        <li>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                        </li>
                    </ul>
                </div>

                {group.tags && group.tags.length > 0 && (
                    <div>
                        <h4 className="font-bold underline text-gray-800 mb-2">
                            Tags
                        </h4>
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
            </div>
        </div>
    );
}
