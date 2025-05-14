import PostSkeleton from "@/components/posts/post/components/PostSkeleton/PostSkeleton";
import PostFormSkeleton from "@components/posts/post-form/PostFormSkeleton";
import "@pages/social/profile/Profile.scss";

const ProfileSkeleton = () => {
    return (
        <div className="profile-wrapper col-span-full h-[88vh] max-h-[88vh] grid grid-cols-3 rounded-t-[30px] overflow-y-scroll lg:overflow-hidden bg-background-blur">
            <div className="profile-header w-full h-[25vh] lg:h-[16vh] col-span-3 relative flex flex-col items-center">
                <div className="w-full h-[25vh] sm:h-[14vh] bg-gray-200 animate-pulse rounded-t-[30px]"></div>
                <div className="absolute left-1/3 sm:left-[10%] -bottom-14 sm:-bottom-10 size-[140px] rounded-full bg-gray-200 animate-pulse border-4 border-white"></div>
            </div>

            <div className="profile-content flex-1 h-[72vh] pt-4 sm:px-4 col-span-3 flex flex-col lg:grid grid-cols-3">
                {/* Information skeleton */}
                <div className="col-span-1 w-full h-max lg:h-full lg:pr-4 rounded-[10px] flex flex-col gap-2 lg:overflow-y-scroll">
                    <div className="w-full p-4 bg-white rounded-[10px] shadow-sm">
                        <div className="w-full h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                        <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded mb-4"></div>

                        <div className="flex gap-2 mt-4">
                            <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded"></div>
                            <div className="w-1/3 h-8 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>

                    <div className="w-full p-4 bg-white rounded-[10px] shadow-sm mt-2">
                        <div className="w-1/2 h-5 bg-gray-200 animate-pulse rounded mb-3"></div>
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <div
                                    key={index}
                                    className="w-full aspect-square bg-gray-200 animate-pulse rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline skeleton */}
                <div className="col-span-2 h-full flex flex-col justify-start bg-primary-white rounded-t-[10px]">
                    <div className="w-full h-max flex items-center justify-between">
                        {["Posts", "Replied", "Followers", "Following"].map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="flex-1 text-sm py-2 text-center border-b-2 border-gray-300 font-bold"
                                >
                                    <div className="w-3/4 h-4 mx-auto bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            )
                        )}
                    </div>
                    <div className="size-full min-h-[500px] max-h-[500px] flex flex-col overflow-y-scroll bg-primary-white p-4">
                        <div style={{ marginBottom: "10px" }}>
                            <PostFormSkeleton />
                        </div>
                        <>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <div key={index}>
                                    <PostSkeleton />
                                </div>
                            ))}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
