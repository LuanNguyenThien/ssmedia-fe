import InformationButton from "@/components/information/count-container/InformationButton";
import SocialEntities from "@/components/information/count-container/SocialEntities";
import { ChatUtils } from "@/services/utils/chat-utils.service";
import { ProfileUtils } from "@/services/utils/profile-utils.service";
import { Utils } from "@/services/utils/utils.service";
import { useCallback } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

const UserCard = ({ user, following, navigate, follow, unFollow }) => {
    const handleClickMessageButton = useCallback(() => {
        if (user) {
            ProfileUtils.navigateToProfile(user, navigate);
        }
    }, [user, navigate]);
    const isFollowed = Utils.checkIfUserIsFollowed(following, user?._id);

    return (
        <div
            onClick={handleClickMessageButton}
            className="w-full  sm:h-[30vh] lg:h-[50vh] cursor-pointer col-span-1 flex flex-col bg-primary-white rounded-lg shadow-sm border-2 hover:border-primary/50 transition-all duration-200 ease-in-out"
        >
            {/* image */}
            <div className="flex border-white justify-center items-center w-full min-h-[50%] max-h-[50%] ">
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            </div>
            {/* name and email */}

            <div className="w-full min-h-[50%] max-h-[50%] py-4 flex flex-col items-center justify-center gap-4">
                <div className="w-full flex flex-col items-center justify-center">
                    <span className="text-xl text-center px-2 font-bold text-primary-black w-full max-w-full truncate">
                        {user.username}
                    </span>
                </div>
                <div className="w-full sm:px-4">
                    <SocialEntities
                        shortenedFollowers={user.followersCount}
                        shortenedFollowing={user.followingCount}
                        shortenedPosts={user.postsCount}
                    />
                </div>

                {/* button */}
                <div className="flex w-full items-center justify-center">
                    <InformationButton
                        title={isFollowed ? "Unfollow" : "Follow"}
                        icon={
                            isFollowed ? (
                                <RiUserUnfollowLine />
                            ) : (
                                <RiUserFollowLine />
                            )
                        }
                        onClick={(e) => {
                            e.stopPropagation();
                            isFollowed ? unFollow(user) : follow(user);
                        }}
                        className="!bg-primary !text-primary-white hover:!bg-primary/70"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserCard;
