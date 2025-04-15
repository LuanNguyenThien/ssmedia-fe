import "@pages/social/following/Following.scss";
import useEffectOnce from "@hooks/useEffectOnce";
import { followerService } from "@services/api/followers/follower.service";
import { socketService } from "@services/socket/socket.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import { Utils } from "@services/utils/utils.service";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import LoadingMessage from "@/components/state/loading-message/LoadingMessage";
import FollowCard from "@/components/card-element/follow/FollowCard";

const Following = () => {
    const { profile } = useSelector((state) => state.user);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    //paging
    const bodyRef = useRef(null);
    const bottomRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFollowersCount, setTotalFollowersCount] = useState(0);
    const PAGE_SIZE = 6;

    useInfiniteScroll(bodyRef, bottomRef, fetchData);

    async function fetchData() {
        setLoading(true);

        if (
            currentPage <= Math.round(totalFollowersCount / PAGE_SIZE) &&
            !loading
        ) {
            setCurrentPage((prevPage) => prevPage + 1);
            await getUserFollowing();
        }

        setLoading(false);
    }

    const getUserFollowing = async () => {
        setLoading(true);
        try {
            const response = await followerService.getUserFollowing();
            setFollowing(response.data.following);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        } finally {
            setLoading(false);
        }
    };

    // const followUser = async (user) => {
    //     try {
    //         FollowersUtils.followUser(user, dispatch);
    //     } catch (error) {
    //         Utils.dispatchNotification(
    //             error.response.data.message,
    //             "error",
    //             dispatch
    //         );
    //     }
    // };

    const unFollowUser = async (user) => {
        try {
            socketService?.socket?.emit("unfollow user", user);
            FollowersUtils.unFollowUser(user, profile, dispatch);
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    useEffectOnce(() => {
        getUserFollowing();
    });

    useEffect(() => {
        FollowersUtils.socketIORemoveFollowing(following, setFollowing);
    }, [following]);

    return (
        <>
            <div
                ref={bodyRef}
                className="size-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
            >
                {following.length > 0 &&
                    following.map((data) => {
                        return (
                            <FollowCard
                                key={data._id}
                                cardData={data}
                                unFollowUser={(e) => {
                                    e.stopPropagation();
                                    unFollowUser(data);
                                }}
                            />
                        );
                    })}

                <div
                    ref={bottomRef}
                    className="py-5 col-span-full size-full flex justify-center items-start "
                >
                    {loading && (
                        <div className="flex justify-center items-center w-full h-full">
                            <div className="size-10">
                                <LoadingMessage />
                            </div>
                        </div>
                    )}
                </div>
                {!loading && !following.length && (
                    <div className="col-span-full size-full flex justify-center items-start text-primary-black font-bold text-xl">
                        There are no followers to display
                    </div>
                )}
            </div>
        </>
    );
};
export default Following;
