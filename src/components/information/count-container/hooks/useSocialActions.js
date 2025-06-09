import { Utils } from "@services/utils/utils.service";
import { ChatUtils } from "@/services/utils/chat-utils.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import { socketService } from "@services/socket/socket.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";

const useSocialActions = ({
    followings,
    user,
    setUser,
    profile,
    setRendered,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const debounceRef = useRef(false);

    // Initialize states with memoized values
    const [isFollow, setIsFollow] = useState(() =>
        Utils.checkIfUserIsFollowed(followings, user?._id)
    );

    const [isBlocked, setIsBlocked] = useState(() =>
        Utils.checkIfUserIsBlocked(profile?.blocked, user?._id)
    );

    // Update states when dependencies change
    useEffect(() => {
        setIsFollow(Utils.checkIfUserIsFollowed(followings, user?._id));
    }, [followings, user?._id]);

    useEffect(() => {
        setIsBlocked(Utils.checkIfUserIsBlocked(profile?.blocked, user?._id));
    }, [profile?.blocked, user?._id]);

    // Prevent actions during debounce period
    const checkDebounce = useCallback(() => {
        if (debounceRef.current) return true;
        debounceRef.current = true;
        setTimeout(() => (debounceRef.current = false), 1000);
        return false;
    }, []);

    const handleClickMessageButton = useCallback(
        (e) => {
            e.stopPropagation();
            if (user) {
                ChatUtils.navigateToChat(user, navigate);
            }
        },
        [user, navigate]
    );

    const followUser = useCallback(
        async (targetUser) => {
            if (checkDebounce()) return;

            try {
                await FollowersUtils.followUser(targetUser, dispatch);
                socketService?.socket?.emit("follow user", targetUser);
                setIsFollow(true);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error following user",
                    "error",
                    dispatch
                );
            } finally {
                setRendered();
            }
        },
        [dispatch, setRendered, checkDebounce]
    );

    const unFollowUser = useCallback(
        async (targetUser) => {
            if (checkDebounce()) return;

            try {
                await FollowersUtils.unFollowUser(
                    targetUser,
                    profile,
                    dispatch
                );
                socketService?.socket?.emit("unfollow user", targetUser);
                setIsFollow(false);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error unfollowing user",
                    "error",
                    dispatch
                );
            } finally {
                setRendered();
            }
        },
        [dispatch, profile, setRendered, checkDebounce]
    );

    const blockUser = useCallback(
        async (targetUser) => {
            if (checkDebounce()) return;

            try {
                socketService?.socket?.emit("block user", {
                    blockedUser: targetUser._id,
                    blockedBy: profile?._id,
                });
                await FollowersUtils.blockUser(targetUser, dispatch);
                setIsBlocked(true);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error blocking user",
                    "error",
                    dispatch
                );
            } finally {
                setRendered();
            }
        },
        [dispatch, profile?._id, setRendered, checkDebounce]
    );

    const unblockUser = useCallback(
        async (targetUser) => {
            if (checkDebounce()) return;

            try {
                socketService?.socket?.emit("unblock user", {
                    blockedUser: targetUser._id,
                    blockedBy: profile?._id,
                });
                await FollowersUtils.unblockUser(targetUser, dispatch);
                setIsBlocked(false);
            } catch (error) {
                Utils.dispatchNotification(
                    error.response?.data?.message || "Error unblocking user",
                    "error",
                    dispatch
                );
            } finally {
                setRendered();
            }
        },
        [dispatch, profile?._id, setRendered, checkDebounce]
    );

    return {
        navigate,
        isFollow,
        isBlocked,
        followUser,
        unFollowUser,
        blockUser,
        unblockUser,
        handleClickMessageButton,
    };
};

export default useSocialActions;
