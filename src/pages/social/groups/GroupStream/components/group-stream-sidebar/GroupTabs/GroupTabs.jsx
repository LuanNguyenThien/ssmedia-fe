import PropTypes from "prop-types";

const GroupTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.key
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

GroupTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
            count: PropTypes.number.isRequired,
        })
    ).isRequired,
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default GroupTabs; 