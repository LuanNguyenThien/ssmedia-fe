import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";

export default function MediaTab({ canViewContent }) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (canViewContent) {
            // Mock API call to fetch group media
            setTimeout(() => {
                setMedia([
                    {
                        id: "1",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                    {
                        id: "2",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                    {
                        id: "3",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                    {
                        id: "4",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                    {
                        id: "5",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                    {
                        id: "6",
                        url: "https://via.placeholder.com/300x300",
                        type: "image",
                    },
                ]);
                setLoading(false);
            }, 800);
        }
    }, [canViewContent]);

    if (!canViewContent) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Media is protected
                </h3>
                <p className="text-gray-600">
                    You need to join the group to see media.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">Media</h3>
                <div className="grid grid-cols-3 gap-2">
                    {Array(6)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                className="aspect-square bg-gray-200 rounded-lg animate-skeleton-animation"
                            ></div>
                        ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Media</h3>
            {media.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={item.url}
                                alt="Group media"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center py-8">
                    No images have been shared yet.
                </p>
            )}
        </div>
    );
}
