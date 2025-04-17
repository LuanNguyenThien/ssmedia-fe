import ActionSelector from "@/components/information/count-container/ActionSelector";
import useSocialActions from "@/components/information/count-container/hooks/useSocialActions";
import InformationButton from "@/components/information/count-container/InformationButton";
import { ProfileUtils } from "@/services/utils/profile-utils.service";
import { useCallback } from "react";
import { TbMessageCircle } from "react-icons/tb";
import { useSelector } from "react-redux";

const PeopleCard = ({ item, setRendered, followings }) => {
    const { profile } = useSelector((state) => state.user);

    const {
        navigate,
        isFollow,
        isBlocked,
        handleClickMessageButton,
        followUser,
        unFollowUser,
        blockUser,
        unblockUser,
    } = useSocialActions({
        followings,
        user: item,
        setRendered,
        profile,
    });
    const isCurrentUser = useCallback(() => {
        if (!profile) return false;
        return item.username === profile?.username;
    }, [item, profile]);
    return (
        <div
            onClick={() => {
                ProfileUtils.navigateToProfile(item, navigate);
            }}
            className="cursor-pointer w-full flex items-center justify-between rounded-[10px] hover:bg-background-blur px-4 py-2"
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-14 rounded-full overflow-hidden bg-red-400">
                    <img
                        src={item.profilePicture}
                        alt="avatar"
                        className="size-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span>{item.username}</span>
                    {item.followersCount >= 1 && (
                        <span className="text-sm font-light">
                            {item.followersCount} follower
                        </span>
                    )}
                </div>
            </div>

            {/* message and follow/unfollow section */}
            {!isCurrentUser() && (
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
                        user={item}
                    />
                </div>
            )}
        </div>
    );
};

export default PeopleCard;
