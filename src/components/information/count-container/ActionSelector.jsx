import { memo, useEffect, useRef, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoBlocked } from "react-icons/go";
import { CgUnblock } from "react-icons/cg";

import InformationButton from "./InformationButton";

const ActionSelector = ({
    isFollow,
    isBlocked,
    onClickFollow,
    onClickUnfollow,
    onClickBlock,
    onClickUnblock,
    user,
}) => {
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                actionsRef.current &&
                !actionsRef.current.contains(event.target)
            ) {
                setShowActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                }}
                className="text-sm w-max flex items-center gap-1 px-4 py-2 bg-background-blur text-primary-black/70 hover:text-primary/50 cursor-pointer rounded-[30px]"
            >
                {isFollow ? (
                    <>
                        <span className="text-xl">
                            <RiUserFollowLine />
                        </span>
                        Followed
                    </>
                ) : (
                    <>
                        <span className="text-xl">
                            <RiUserUnfollowLine />
                        </span>
                        Unfollow
                    </>
                )}
            </div>

            {showActions && (
                <div
                    ref={actionsRef}
                    className="absolute z-10 top-10 left-0 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px]"
                >
                    {!isFollow ? (
                        <InformationButton
                            title="Follow"
                            icon={<RiUserFollowLine />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickFollow(user);
                            }}
                            className={"!bg-primary-white"}
                        />
                    ) : (
                        <InformationButton
                            title="Unfollow"
                            icon={<RiUserUnfollowLine />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickUnfollow(user);
                            }}
                            className="hover:!text-red-500 !bg-primary-white"
                        />
                    )}

                    {isBlocked ? (
                        <InformationButton
                            title="Unblock"
                            icon={<CgUnblock />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickUnblock(user);
                            }}
                            className="!bg-primary-white hover:!text-red-500"
                        />
                    ) : (
                        <InformationButton
                            title="Block"
                            icon={<GoBlocked />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickBlock(user);
                            }}
                            className="!bg-primary-white hover:!text-red-500"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(ActionSelector);
