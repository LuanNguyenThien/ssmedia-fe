const SOCIAL_DOMAINS = {
    facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com', 'www.fb.com'],
    instagram: ['instagram.com', 'www.instagram.com', 'm.instagram.com'],
    twitter: ['twitter.com', 'www.twitter.com', 'm.twitter.com', 'x.com', 'www.x.com'],
    youtube: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'],
};

export const isValidUrl = (url) => {
    try {
        new URL(url);
        return /^(https?:\/\/)/.test(url); 
    } catch {
        return false;
    }
};

export const isValidSocialUrl = (url, type) => {
    if (!url || !type || !isValidUrl(url)) return false;
    
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        
        // Get expected domains for this social media type
        const expectedDomains = SOCIAL_DOMAINS[type.toLowerCase()];
        if (!expectedDomains) return true; // If type not recognized, just validate as regular URL
        
        // Check if hostname matches any of the expected domains
        return expectedDomains.some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
};

export const SocialInfoItem = ({ icon, value, type }) => {
    if (!value || !isValidSocialUrl(value, type)) return null;
    
    const handleClick = () => {
        window.open(value, "_blank", "noopener,noreferrer");
    };

    return (
        <div 
            className="w-full flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-150" 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label={`Open ${type} profile`}
        >
            <div className="size-4 flex-shrink-0">
                <img
                    src={icon}
                    className="size-full object-cover"
                    alt={`${type} icon`}
                />
            </div>
            <span className="flex-1 max-w-[90%] truncate text-sm text-gray-700">{value}</span>
        </div>
    );
};
