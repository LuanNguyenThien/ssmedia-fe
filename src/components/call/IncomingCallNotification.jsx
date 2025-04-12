import React from "react";
import "./IncomingCallNotification.scss";

const IncomingCallNotification = ({ callData, onAccept, onReject }) => {
    return (
        <div className="incoming-call-notification">
            <div className="notification-content">
                <h3>{callData.callerName || "Unknown Caller"} is calling...</h3>
                <p>{callData.callType === "video" ? "Video Call" : "Voice Call"}</p>
                <div className="notification-actions">
                    <button className="accept-button" onClick={onAccept}>
                        Accept
                    </button>
                    <button className="reject-button" onClick={onReject}>
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallNotification;