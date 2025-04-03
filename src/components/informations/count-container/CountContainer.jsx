import PropTypes from "prop-types";
import { Utils } from "@services/utils/utils.service";
import CountContainerSkeleton from "components/informations/count-container/CountContainerSkeleton";
import "@components/timeline/Timeline.scss";

const CountContainer = ({
    followingCount,
    followersCount,
    loading,
    profile,
}) => {
    return (
        <>
            {loading ? (
                <CountContainerSkeleton />
            ) : (
                <div className="size-full z-50  flex flex-col justify-start items-center gap-2 px-4">
                    <span className="font-extrabold text-xl text-primary-black">
                        {profile.username}
                    </span>

                    {profile.quote.length > 0 && (
                        <span className="w-full h-max text-sm font-normal  text-center">
                            {profile.quote}
                        </span>
                    )}

                    <div className="w-full grid grid-cols-3 gap-2 text-xs lg:text-sm">
                        <div className="size-full text-center col-span-1 border-r">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(followersCount)}
                            </span>
                            <p>{`${
                                followersCount > 1 ? "Followers" : "Follower"
                            }`}</p>
                        </div>
                        <div className="text-center col-span-1">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(followingCount)}
                            </span>
                            <p>Following</p>
                        </div>
                        <div className="text-center col-span-1 border-l ">
                            <span className="" data-testid="info">
                                {Utils.shortenLargeNumbers(profile.postsCount)}
                            </span>
                            <p>Posts</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

CountContainer.propTypes = {
    followingCount: PropTypes.number,
    followersCount: PropTypes.number,
    loading: PropTypes.bool,
};

export default CountContainer;
