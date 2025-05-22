import "@pages/social/Social.scss";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@components/sidebar/Sidebar";
import HeaderMb from "@components/header/HeaderMb";
import SidebarMb from "@components/sidebar/SidebarMb";
import Header from "@components/header/Header";
import StickySidebar from "@components/sidebar/StickySidebar";
import { includes } from "lodash";
import useIsMobile from "@hooks/useIsMobile";

const layout_1_4_list = ["streams", "profile", "save", "people", "post"];
const layout_0_5_list = ["chat", "groups", "meeting", "search"];

const Social = () => {
    const isMobile = useIsMobile();
    const section = useLocation().pathname.split("/")[3];

    const getLayout = () => {
        if (isMobile) {
            return <Outlet />;
        }

        if (includes(layout_1_4_list, section)) {
            return (
                <>
                    <div className="col-span-3 lg:col-span-2">
                        <Sidebar />
                    </div>
                    <div className="col-span-7 lg:col-span-8">
                        <Outlet />
                    </div>
                </>
            );
        }

        if (includes(layout_0_5_list, section)) {
            return (
                <div className="col-span-10 max-h-[88vh] min-h-[88vh] relative">
                    <StickySidebar />
                    <Outlet />
                </div>
            );
        }

        return (
            <>
                <div className="col-span-2">
                    <Sidebar />
                </div>
                <div className="col-span-8 grid grid-cols-4">
                    <Outlet />
                </div>
            </>
        );
    };
    return (
        <div className={`!bg-secondary sm:px-12`}>
            {isMobile ? <HeaderMb /> : <Header />}
            <div className={`grid grid-cols-10 ${isMobile ? "pb-[8dvh]" : ""}`}>
                {getLayout()}
            </div>
            {isMobile && <SidebarMb />}
        </div>
    );
};

export default Social;
