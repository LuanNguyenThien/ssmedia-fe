import { INTERESTS } from "@/components/personalize/constant";
const COLORS = [
    "bg-pink-2 bg-primary-white text-pink-700 border-pink-300",
    "bg-blue-2 bg-primary-white text-blue-700 border-blue-300",
    "bg-green-2 bg-primary-white text-green-700 border-green-300",
    "bg-yellow-2 bg-primary-white text-yellow-700 border-yellow-300",
    "bg-purple-2 bg-primary-white text-purple-700 border-purple-300",
    "bg-orange-2 bg-primary-white text-orange-700 border-orange-300",
    "bg-teal-2 bg-primary-white text-teal-700 border-teal-300",
];
const getColor = (idx) => COLORS[idx % COLORS.length];

const PersonalizeTabs = ({ items, onEdit, onAdd, isCurrentUser, user }) => {
    const filteredInterests =
        user?.user_hobbies?.subject &&
        INTERESTS.filter((interest) =>
            user?.user_hobbies?.subject.includes(interest.value)
        );

    if (!filteredInterests || filteredInterests.length === 0) {
        if (isCurrentUser) {
            return (
                <div className="w-full flex items-center justify-center py-2">
                    <div className=" flex flex-row items-center gap-2">
                        <button
                            className="size-6 text-xl rounded-full bg-gradient-to-br from-primary to-primary/10 shadow-xl flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30"
                            onClick={onAdd}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") onAdd();
                            }}
                        >
                            +
                        </button>
                        <span className=" text-xs  text-black rounded py-1  pointer-events-none  select-none">
                            Tell us what excites you!
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <>
            {user && (
                <div className="flex flex-wrap gap-2 items-center py-1 px-2 sm:px-2">
                    {filteredInterests &&
                        filteredInterests.map((subject, idx) => (
                            <span
                                key={subject.label}
                                className={`px-2 py-1 rounded-[30px] border font-medium text-sm ${getColor(
                                    idx
                                )}   transition-all duration-300 hover:scale-110 cursor-pointer`}
                            >
                                <span className="capitalize">
                                    {subject.label}
                                </span>
                            </span>
                        ))}

                    {isCurrentUser && (
                        <button
                            className="bg-primary-white rounded-full px-1 py-1 font-semibold text-sm flex items-center hover:text-primary/90 hover:scale-105 active:scale-95 transition-all"
                            onClick={onEdit}
                            aria-label="Edit your interests"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default PersonalizeTabs;
