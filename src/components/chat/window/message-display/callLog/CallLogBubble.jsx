import PropTypes from "prop-types"
import { FaPhoneAlt, FaVideo, FaPhoneSlash, FaPhoneVolume } from "react-icons/fa"
import { MdMissedVideoCall, MdPhoneMissed } from "react-icons/md"
import "@components/chat/window/message-display/callLog/CallLogBubble.scss";

const CallLogBubble = ({ chat, isRight }) => {
  // Xác định biểu tượng dựa vào loại cuộc gọi và trạng thái
  const getCallIcon = () => {
    // Nếu là cuộc gọi bị nhỡ
    if (chat?.callStatus === "missed") {
      return chat?.callType === "video" ? (
        <MdMissedVideoCall className="call-icon-svg" />
      ) : (
        <MdPhoneMissed className="call-icon-svg" />
      )
    }
    // Nếu là cuộc gọi bị từ chối
    else if (chat?.callStatus === "rejected") {
      return chat?.callType === "video" ? (
        <MdMissedVideoCall className="call-icon-svg" />
      ) : (
        <FaPhoneSlash className="call-icon-svg" />
      )
    }
    // Nếu là cuộc gọi đã kết thúc bình thường
    else if (chat?.callStatus === "ended") {
      if (isRight) {
        return chat?.callType === "video" ? (
          <FaVideo className="call-icon-svg" />
        ) : (
          <FaPhoneVolume className="call-icon-svg" />
        )
      } else {
        return chat?.callType === "video" ? (
          <FaVideo className="call-icon-svg" />
        ) : (
          <FaPhoneAlt className="call-icon-svg" />
        )
      }
    } else {
      // Mặc định
      return chat?.callType === "video" ? (
        <FaVideo className="call-icon-svg" />
      ) : (
        <FaPhoneAlt className="call-icon-svg" />
      )
    }
  }

  // Xác định class cho container dựa vào trạng thái và hướng
  const getContainerClass = () => {
    const baseClass = isRight ? "call-log-container-right" : "call-log-container-left"

    if (chat?.callStatus === "missed" || chat?.callStatus === "rejected") {
      return `${baseClass} call-missed`
    } else if (chat?.callStatus === "ended") {
      return `${baseClass} call-success`
    }

    return baseClass
  }

  // Xác định class cho icon dựa vào trạng thái
  const getIconClass = () => {
    if (chat?.callStatus === "missed" || chat?.callStatus === "rejected") {
      return "call-icon missed"
    } else if (chat?.callStatus === "ended") {
      return "call-icon success"
    }

    return "call-icon"
  }

  // Format call duration
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "";
    
    if (seconds < 60) {
      return `${seconds} giây`
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (remainingSeconds === 0) {
      return `${minutes} phút`
    }

    return `${minutes} phút ${remainingSeconds} giây`
  }

  return (
    <div className={getContainerClass()}>
      <div className="call-log-content">
        <div className={getIconClass()}>{getCallIcon()}</div>
        <div className="call-details">
          <div className="call-message">{chat?.body}</div>
          {chat?.callStatus === "ended" && chat?.callDuration > 0 && (
            <div className="call-duration">{formatDuration(chat?.callDuration)}</div>
          )}
        </div>
      </div>
    </div>
  )
}

CallLogBubble.propTypes = {
  chat: PropTypes.shape({
    callType: PropTypes.oneOf(["audio", "video"]),
    callStatus: PropTypes.oneOf(["missed", "rejected", "ended"]),
    body: PropTypes.string,
    callDuration: PropTypes.number,
  }).isRequired,
  isRight: PropTypes.bool.isRequired,
}

export default CallLogBubble