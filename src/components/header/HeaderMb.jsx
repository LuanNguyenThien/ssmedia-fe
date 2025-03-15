import { useNavigate } from "react-router-dom";
import Logo from "@components/logo/logo";
const HeaderMb = () => {
    const navigate = useNavigate();
    return (
        <div className="h-[8vh] bg-secondary flex items-center justify-between px-4">
            <div
                className=""
                onClick={() => {
                    navigate("/app/social/streams");
                    window.location.reload();
                }}
            >
                <Logo />
            </div>
            <div className="flex items-center justify-end">
                
            </div>
        </div>
    );
};

export default HeaderMb;
