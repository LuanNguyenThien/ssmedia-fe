import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import ProfileSectionSkeleton from "./ProfileSectionSkeleton";

const ProfileSection = () => {
    const { profile } = useSelector((state) => state.user);
    return (
        <>
            {!profile ? (
                <ProfileSectionSkeleton />
            ) : (
                <div className="w-full bg-background-blur/40 rounded-2xl p-6 flex flex-col items-center shadow-md">
                    <img
                        src={profile?.profilePicture || "/default-avatar.png"}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow"
                    />
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg truncate max-w-[120px]">
                            {profile?.username || "User"}
                        </span>
                        <FaCheckCircle
                            className="text-blue-500"
                            title="Verified"
                        />
                    </div>
                    <span className="text-gray-500 text-sm mb-4 truncate max-w-[140px]">
                        @{profile?.username?.toLowerCase() || "username"}
                    </span>
                    <div className="flex w-full justify-between mt-2">
                        <div className="flex flex-col items-center flex-1">
                            <span className="font-semibold text-base">
                                {profile?.followersCount ?? 0}
                            </span>
                            <span className="text-xs text-gray-500">
                                Follower
                            </span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <span className="font-semibold text-base">
                                {profile?.followingCount ?? 0}
                            </span>
                            <span className="text-xs text-gray-500">
                                Following
                            </span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <span className="font-semibold text-base">
                                {profile?.postsCount ?? 0}
                            </span>
                            <span className="text-xs text-gray-500">Post</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileSection;
