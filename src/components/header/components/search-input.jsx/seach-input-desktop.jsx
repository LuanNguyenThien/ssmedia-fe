import { icons } from "@assets/assets";

const SearchInputDesktop = ({ onClick, searchTerm, setSearchTerm }) => {
    return (
        <div className="relative rounded-xl max-w-2/3 overflow-hidden shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className="h-full absolute flex items-center left-4 text-gray-500">
                <img src={icons.search} alt="" className="w-6 h-6" />
            </div>
            <input
                onKeyDown={(e) => e.key === "Enter" && onClick()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find friends, communicate..."
                className="input  border-gray-300 pl-12 pr-4 py-3 rounded-xl w-72 transition-all duration-300 focus:w-96 outline-none ring-0"
                name="search"
                type="search"
            />
        </div>
    );
};

export default SearchInputDesktop;
