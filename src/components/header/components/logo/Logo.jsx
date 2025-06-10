import { assets } from "@assets/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPosts } from "@redux/api/posts";
import useIsMobile from "@hooks/useIsMobile";

const Logo = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <div
            className={`w-fit h-10 cursor-pointer flex items-center justify-start gap-1 ${
                isMobile ? "max-w-10" : ""
            }`}
            onClick={() => {
                dispatch(getPosts());
                navigate("/app/social/streams");
            }}
        >
            <img src={assets.logo} alt="logo" className="size-10" />
            {!isMobile && (
                <span className="h-full flex items-center text-xl font-extrabold text-[#1264AB]">
                    RAINET
                </span>
            )}
        </div>
    );
};

export default Logo;
