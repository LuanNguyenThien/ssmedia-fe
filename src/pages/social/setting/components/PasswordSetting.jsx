import Button from "@components/button/Button";
import Input from "@components/input/Input";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import { userService } from "@services/api/user/user.service";
import { Utils } from "@services/utils/utils.service";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const PasswordSetting = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [type, setType] = useState("password");
    const [togglePassword, setTogglePassword] = useState(false);
    const [deleteStorageUsername] = useLocalStorage("username", "delete");
    const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
    const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const togglePasswordDisplay = () => {
        setTogglePassword(!togglePassword);
        const inputType = type === "password" ? "text" : "password";
        setType(inputType);
    };

    const changePassword = async (event) => {
        event.preventDefault();
        try {
            const response = await userService.changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            if (response) {
                Utils.dispatchNotification(
                    response.data.message,
                    "success",
                    dispatch
                );
                setTimeout(async () => {
                    Utils.clearStore({
                        dispatch,
                        deleteStorageUsername,
                        deleteSessionPageReload,
                        setLoggedIn,
                    });
                    await userService.logoutUser();
                    navigate("/");
                }, 3000);
            }
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={changePassword} >
                <div>
                    <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={type}
                        value={currentPassword}
                        labelText="Current Password"
                        placeholder=""
                        handleChange={(event) =>
                            setCurrentPassword(event.target.value)
                        }
                        className=" border rounded-[15px] px-4 py-2"
                    />
                </div>
                <div>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type={type}
                        value={newPassword}
                        labelText="New Password"
                        placeholder=""
                        handleChange={(event) =>
                            setNewPassword(event.target.value)
                        }
                        className=" border rounded-[15px] px-4 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters and include a mix
                        of letters, numbers and symbols.
                    </p>
                </div>
                <div>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={type}
                        value={confirmPassword}
                        labelText="Confirm Password"
                        placeholder=""
                        handleChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        className=" border rounded-[15px] px-4 py-2"
                    />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <Button
                        label="Update"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={
                            !currentPassword || !newPassword || !confirmPassword
                        }
                    />
                    <span
                        className="ml-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        data-testid="eye-icon"
                        onClick={togglePasswordDisplay}
                    >
                        {!togglePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default PasswordSetting;
