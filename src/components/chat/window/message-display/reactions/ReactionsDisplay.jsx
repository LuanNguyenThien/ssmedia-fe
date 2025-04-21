import { reactionsMap } from "@services/utils/static.data";

const ReactionsDisplay = ({ reactions = [], direction, onClick }) => {
    if (!reactions || reactions.length === 0) return null;

    // Group reactions by type
    const reactionCount = reactions.reduce((acc, curr) => {
        const type = curr?.type;
        if (type) {
            acc[type] = (acc[type] || 0) + 1;
        }
        return acc;
    }, {});

    return (
        <div className="flex items-center gap-0.5">
            {Object.entries(reactionCount).map(([type, count]) => (
                <div
                    onClick={onClick}
                    key={type}
                    className={`relative size-4 ${
                        count > 1 && !direction ? "mr-0.5" : ""
                    } ${direction && count > 1 ? "mr-2" : ""}`}
                >
                    <img
                        className="size-full object-cover"
                        src={reactionsMap[type]}
                        alt={type}
                    />
                    {count > 1 && (
                        <span className="absolute -bottom-2 -right-2.5  text-primary-black font-semibold  flex justify-center items-center text-[10px] rounded-full p-1 leading-none">
                            {count}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReactionsDisplay;
