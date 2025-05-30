import useIsMobile from "@hooks/useIsMobile";

const sideBarItems = [
    { id: 1, name: "All" },
    { id: 2, name: "Posts" },
    { id: 3, name: "People" },
];

const SearchSidebar = ({ state, setState }) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="bg-primary-white rounded-[30px] w-full p-4">
                <span className="text-xl font-bold block mb-4">
                    Search results
                </span>

                <div className="flex overflow-x-auto gap-2 pb-1">
                    {sideBarItems.map((item) => (
                        <div
                            onClick={() => setState(item.name)}
                            key={item.id}
                            className={`flex place-content-center px-6 py-2 rounded-full whitespace-nowrap cursor-pointer transition-colors
                                ${
                                    state === item.name
                                        ? "bg-primary/70 text-primary-white font-medium"
                                        : "bg-gray-100 text-primary-gray border border-background-blur"
                                }`}
                        >
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary-white rounded-[30px] p-6 mb-4 w-full sm:w-1/3 lg:w-1/4 flex flex-col">
            <span className="text-2xl font-bold pb-2 ">Search results</span>

            <div className="flex flex-col w-full gap-1">
                {sideBarItems.map((item) => (
                    <div
                        onClick={() => setState(item.name)}
                        key={item.id}
                        className={`flex items-center gap-2 cursor-pointer hover:bg-primary-light rounded-lg py-2 px-4
                            ${
                                state === item.name
                                    ? "bg-primary/70 text-primary-white"
                                    : "text-primary-gray bg-background-blur/50 hover:bg-background-blur"
                            }`}
                    >
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchSidebar;
