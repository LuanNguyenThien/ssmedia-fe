import Button from "@components/button/Button";
import Toggle from "@components/toggle/Toggle";
import { updateUserProfile } from "@redux/reducers/user/user.reducer";
import { userService } from "@services/api/user/user.service";
import { notificationItems } from "@services/utils/static.data";
import { Utils } from "@services/utils/utils.service";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const NotificationSetting = () => {
    // Get user profile from redux
    let { profile } = useSelector((state) => state.user);
    const [notificationTypes, setNotificationTypes] = useState([]);
    let [notificationSettings, setNotificationSettings] = useState(
        profile?.notifications
    );
    const dispatch = useDispatch();
    const [isCallingNotification, setIsCallingNotification] = useState(false);

    // Map notificationItems to toggles based on user settings
    const mapNotificationTypesToggle = useCallback(
        (notifications) => {
            for (const notification of notifications) {
                const toggled = notificationSettings[notification.type];
                notification.toggle = toggled;
            }
            setNotificationTypes(notifications);
        },
        [notificationSettings]
    );

    // Toggle a notification type
    const updateNotificationTypesToggle = (itemIndex) => {
        const updatedData = notificationTypes.map((item, index) => {
            if (index === itemIndex) {
                return {
                    ...item,
                    toggle: !item.toggle,
                };
            }
            return item;
        });
        setNotificationTypes(updatedData);
    };

    // Save notification settings to backend
    const sendNotificationSettings = async () => {
        try {
            const response = await userService.updateNotificationSettings(
                notificationSettings
            );
            profile = cloneDeep(profile);
            profile.notifications = response.data.settings;
            dispatch(updateUserProfile(profile));
            Utils.dispatchNotification(
                response.data.message,
                "success",
                dispatch
            );
        } catch (error) {
            Utils.dispatchNotification(
                error.response.data.message,
                "error",
                dispatch
            );
        }
    };

    const handleCallingNotification = (value) => {
        localStorage.setItem("notificationPromptDismissed", value);
        setIsCallingNotification(value);
    };

    useEffect(() => {
        const value = localStorage.getItem("notificationPromptDismissed");
        setIsCallingNotification(value === "true");
    }, []);

    // Sync notificationItems with user settings
    useEffect(() => {
        mapNotificationTypesToggle(notificationItems);
    }, [notificationTypes, mapNotificationTypesToggle]);

    return (
        <div className="space-y-6">
            {/* calling sendNotificationSettings */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold ">Calling Settings</h2>
                <NotificationItem
                    item={{
                        title: "Call Notifications",
                        description:
                            "Receive notifications when someone calls you",
                        toggle: Boolean(isCallingNotification),
                    }}
                    onClick={() => {
                        handleCallingNotification(!isCallingNotification);
                    }}
                />
            </div>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold ">
                    Notification Settings
                </h2>
                <div className="space-y-6">
                    {notificationTypes.map((data, index) => (
                        <NotificationItem
                            item={data}
                            onClick={() => {
                                updateNotificationTypesToggle(index);
                                notificationSettings =
                                    cloneDeep(notificationSettings);
                                notificationSettings[data.type] =
                                    !notificationSettings[data.type];
                                setNotificationSettings(notificationSettings);
                            }}
                        />
                        // <div
                        //     className="bg-gray-50 rounded-lg shadow-sm p-4 flex items-center justify-between"
                        //     key={Utils.generateString(10)}
                        //     data-testid="notification-settings-item"
                        // >
                        //     <div>
                        //         <h4 className="font-medium text-base mb-1">
                        //             {data.title}
                        //         </h4>
                        //         <p className="text-sm text-gray-600">
                        //             {data.description}
                        //         </p>
                        //     </div>
                        //     <Toggle
                        //         toggle={data.toggle}
                        //         onClick={() => {
                        //             updateNotificationTypesToggle(index);
                        //             notificationSettings =
                        //                 cloneDeep(notificationSettings);
                        //             notificationSettings[data.type] =
                        //                 !notificationSettings[data.type];
                        //             setNotificationSettings(notificationSettings);
                        //         }}
                        //     />
                        // </div>
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <Button
                        label="Update"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={false}
                        handleClick={sendNotificationSettings}
                    />
                </div>
            </div>
        </div>
    );
};

const NotificationItem = ({ item, onClick }) => {
    console.log(item);
    return (
        <div
            className="bg-gray-50 rounded-lg shadow-sm p-4 flex items-center justify-between"
            key={Utils.generateString(10)}
            data-testid="notification-settings-item"
        >
            <div>
                <h4 className="font-medium text-base mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <Toggle
                toggle={Boolean(item.toggle)}
                onClick={() => {
                    onClick();
                }}
            />
        </div>
    );
};
export default NotificationSetting;
