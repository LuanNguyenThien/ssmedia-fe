const SocialEntities = ({
    shortenedFollowers,
    shortenedFollowing,
    shortenedPosts,
}) => {
    return (
        <div className="w-full h-max grid grid-cols-3 gap-2 text-[10px] lg:text-sm">
            <div className="text-center col-span-1 border-r">
                <span className="" data-testid="info">
                    {shortenedFollowers}
                </span>
                <p>{`${
                    Number(shortenedFollowers) > 1 ? "Followers" : "Follower"
                }`}</p>
            </div>
            <div className="text-center col-span-1">
                <span className="" data-testid="info">
                    {shortenedFollowing}
                </span>
                <p>Following</p>
            </div>
            <div className="text-center col-span-1 border-l ">
                <span className="" data-testid="info">
                    {shortenedPosts}
                </span>
                <p>Posts</p>
            </div>
        </div>
    );
};

export default SocialEntities;
