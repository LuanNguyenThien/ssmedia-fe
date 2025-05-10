import "@components/sidebar/Sidebar.scss";
import ProfileSection from "./components/ProfileSection";
import SidebarItems from "./components/SidebarItems";
import ActivitySection from "./components/ActivitySection";

const Sidebar = () => {
    return (
        <div
            className={`app-side-menu h-[88vh] max-h-[88vh] pb-2 bg-transparent pr-5 `}
        >
            <div className="side-menu flex flex-col gap-4 h-full overflow-y-scroll ">
                {/* profile section */}
                <ProfileSection />

                {/* sidebar items section */}
                <SidebarItems />

                {/* addition items section */}
                {/* <ActivitySection /> */}
            </div>
        </div>
    );
};

export default Sidebar;
