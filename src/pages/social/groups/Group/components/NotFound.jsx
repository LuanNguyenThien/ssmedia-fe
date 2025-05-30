import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="bg-background-blur h-full w-full col-span-full rounded-t-3xl p-6">
            <div className="max-w-2xl mx-auto text-center py-12 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSearch className="text-gray-400 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Group not found
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                    The group you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/social/groups"
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        Browse Groups
                    </Link>
                    <Link
                        to="/social"
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Return to Feed
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 