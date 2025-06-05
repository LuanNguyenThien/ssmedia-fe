import { useState, useEffect } from "react";
import { FaLock, FaCheck, FaTimes, FaUser, FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";
import { groupService } from "@services/api/group/group.service";

export default function ApprovalTab({ group, canViewContent, isGroupAdmin }) {
  const dispatch = useDispatch();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (canViewContent && isGroupAdmin && group?._id) {
        try {
          setLoading(true);
          console.log("Fetching pending requests for group:", group._id);
          const response = await groupService.getpendinguser(group._id);
          console.log("Pending requests response:", response);
          setPendingRequests(response.data?.pendingMembers || []);
        } catch (error) {
          Utils.dispatchNotification(
            error.response?.data?.message || "Failed to fetch pending requests",
            "error",
            dispatch
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPendingRequests();
  }, [canViewContent, isGroupAdmin, group?._id, dispatch]);

  const handleApproveRequest = async (requestId, userId) => {
    setProcessingId(requestId);
    try {
      const response = await groupService.approveMemberByAdmin(
        group._id,
        userId
      );
      Utils.dispatchNotification(
        response.data?.message || "Join request approved successfully",
        "success",
        dispatch
      );
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      Utils.dispatchNotification(
        error.response?.data?.message || "Failed to approve join request",
        "error",
        dispatch
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineRequest = async (requestId, userId) => {
    setProcessingId(requestId);
    try {
      const response = await groupService.rejectMemberByAdmin(
        group._id,
        userId
      );
      Utils.dispatchNotification(
        response.data?.message || "Join request declined successfully",
        "success",
        dispatch
      );
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      Utils.dispatchNotification(
        error.response?.data?.message || "Failed to decline join request",
        "error",
        dispatch
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (!isGroupAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Admin access required
        </h3>
        <p className="text-gray-600">
          Only group administrators can view join requests.
        </p>
      </div>
    );
  }

  if (!canViewContent) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLock className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Content is protected
        </h3>
        <p className="text-gray-600">
          You need to join the group to access this content.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-skeleton-animation"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-skeleton-animation"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mt-2 animate-skeleton-animation"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mt-3 animate-skeleton-animation"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No pending requests
        </h3>
        <p className="text-gray-600">
          All join requests have been processed. New requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pending Requests</h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
          {pendingRequests.length}{" "}
          {pendingRequests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                {request.profilePicture ? (
                  <img
                    src={request.profilePicture}
                    alt={`${request.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{request.username.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {request.username}
                    </h4>
                    {/* <p className="text-sm text-gray-500">{request.email}</p> */}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaClock size={12} />
                    <span>{request.joinedAt}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    "{request.message}"
                  </p>
                </div>

                {request.mutualConnections > 0 && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mb-3">
                    <FaUser size={10} />
                    <span>
                      {request.mutualConnections} mutual connection
                      {request.mutualConnections !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleApproveRequest(request.id, request.userId)
                    }
                    disabled={processingId === request.id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    {processingId === request.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaCheck size={14} />
                    )}
                    {processingId === request.id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() =>
                      handleDeclineRequest(request.id, request.userId)
                    }
                    disabled={processingId === request.id}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    {processingId === request.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTimes size={14} />
                    )}
                    {processingId === request.id ? "Processing..." : "Decline"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
