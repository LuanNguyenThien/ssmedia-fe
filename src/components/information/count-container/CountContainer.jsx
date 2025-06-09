import { Utils } from "@services/utils/utils.service";
import "@components/timeline/Timeline.scss";
import { TbMessageCircle } from "react-icons/tb";
import InformationButton from "./InformationButton";
import ActionSelector from "./ActionSelector";
import useSocialActions from "./hooks/useSocialActions";
import { memo, useMemo } from "react";
import SocialEntities from "./SocialEntities";

const CountContainer = ({
    followingCount,
    followersCount,
    user,
    setUser,
    profile,
    followings,
    isCurrentUser,
    setRendered,
    handleReportUser,
}) => {
    const {
        isFollow,
        isBlocked,
        handleClickMessageButton,
        followUser,
        unFollowUser,
        blockUser,
        unblockUser,
    } = useSocialActions({
        followings,
        user,
        setUser,
        profile,
        setRendered,
    });

    const shortenedFollowers = useMemo(
        () => Utils.shortenLargeNumbers(followersCount),
        [followersCount]
    );
    const shortenedFollowing = useMemo(
        () => Utils.shortenLargeNumbers(followingCount),
        [followingCount]
    );
    const shortenedPosts = useMemo(
        () => Utils.shortenLargeNumbers(user?.postsCount),
        [user?.postsCount]
    );

    return (
        <div className="w-full h-auto z-50 flex flex-col justify-start items-center gap-2 px-4">
            {/* username and bio */}
            {user && (
                <>
                    <span className="font-extrabold text-xl text-primary-black">
                        {user?.username}
                    </span>

                    {user?.quote.length > 0 && (
                        <div className="w-full bg-primary-white text-sm font-normal text-center truncate whitespace-pre-wrap">
                            {user?.quote}
                        </div>
                    )}
                </>
            )}

            {/* user information section */}

            <SocialEntities
                shortenedFollowers={shortenedFollowers}
                shortenedFollowing={shortenedFollowing}
                shortenedPosts={shortenedPosts}
            />

            {/* message and follow/unfollow section */}
            {!isCurrentUser && (
                <div className="flex items-center gap-2 pt-3">
                    <InformationButton
                        title={"Message"}
                        icon={<TbMessageCircle />}
                        onClick={handleClickMessageButton}
                        className={"!bg-primary !text-primary-white"}
                    />

                    <ActionSelector
                        isFollow={isFollow}
                        isBlocked={isBlocked}
                        onClickFollow={followUser}
                        onClickUnfollow={unFollowUser}
                        onClickBlock={blockUser}
                        onClickUnblock={unblockUser}
                        onClickReport={handleReportUser}
                        user={user}
                    />
                </div>
            )}
        </div>
    );
};
export default memo(CountContainer);
