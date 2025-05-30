import React, { useState, useEffect } from "react";
import "./NotificationPermissionPrompt.scss";
import logo from "@assets/logo.png"; // Thay đổi đường dẫn theo cấu trúc dự án của bạn
import { FaBell } from "react-icons/fa";
import useIsMobile from "@hooks/useIsMobile";

const NotificationPermissionPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const isMobile = useIsMobile();
    useEffect(() => {
        if ("Notification" in window) {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 2000);

            localStorage.setItem("notificationPromptDismissed", false);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRequestPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted" && !isMobile) {
                // Có thể hiện thông báo test
                new Notification("Đã bật thông báo thành công!", {
                    body: "Bạn sẽ nhận được thông báo khi có cuộc gọi đến",
                    icon: logo, // Thay đổi theo logo của bạn
                });
            }
            localStorage.setItem("notificationPromptDismissed", true);
            setShowPrompt(false);
        });
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Lưu trạng thái đã từ chối vào localStorage để không hiện lại trong phiên
        localStorage.setItem("notificationPromptDismissed", false);
    };

    if (!showPrompt) return null;

    return (
        <div className="notification-permission-prompt">
            <div className="permission-content">
                <div className="permission-icon">
                    <FaBell size={20} color="white" />
                </div>
                <div className="permission-text">
                    <h4>Bật thông báo</h4>
                    <p>
                        Cho phép thông báo để không bỏ lỡ cuộc gọi và tin nhắn
                        quan trọng
                    </p>
                </div>
            </div>
            <div className="permission-actions">
                <button
                    className="allow-button"
                    onClick={handleRequestPermission}
                >
                    Cho phép
                </button>
                <button className="dismiss-button" onClick={handleDismiss}>
                    Để sau
                </button>
            </div>
        </div>
    );
};

export default NotificationPermissionPrompt;
