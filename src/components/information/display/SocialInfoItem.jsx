export const isValidUrl = (url) => {
    try {
        new URL(url);
        return /^(https?:\/\/)/.test(url); 
    } catch (_) {
        return false;
    }
};

export const SocialInfoItem = ({ icon, value }) => {
    if (!value || !isValidUrl(value)) return null;
    return (
        <div className="w-full flex justify-start items-center gap-2 cursor-pointer" onClick={() => window.open(value, "_blank")}>
            <div className="size-4">
                <img
                    src={icon}
                    className="size-full object-cover"
                    alt="social_icon"
                />
            </div>
            <span className="size-full max-w-[90%] truncate ">{value}</span>
            
        </div>
    );
};
