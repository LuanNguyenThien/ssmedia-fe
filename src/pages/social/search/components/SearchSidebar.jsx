const sideBarItems = [
    { id: 1, name: "All" },
    { id: 2, name: "Posts" },
    { id: 3, name: "People" },
];
const SearchSidebar = ({ state, setState }) => {
    return (
        <div className="bg-primary-white rounded-[30px] p-6 mb-4 w-1/4 flex flex-col">
            <span className="text-2xl font-extrabold">Search results</span>

            <span className="pt-4 pb-2 border-t text-lg  font-bold">Filters</span>

            <div className="flex flex-col w-full gap-1">
                {sideBarItems.map((item) => (
                    <div
                        onClick={() => setState(item.name)}
                        key={item.id}
                        className={`flex items-center gap-2 cursor-pointer hover:bg-primary-light rounded-lg py-2 px-4
                            ${
                                state === item.name
                                    ? "bg-primary/70 text-primary-white"
                                    : "text-primary-gray border border-background-blur hover:bg-background-blur"
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
