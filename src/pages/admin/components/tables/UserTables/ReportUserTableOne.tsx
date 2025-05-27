import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import React, { useState, useCallback, useEffect } from "react";
import { userService } from "@services/api/user/user.service";
import useEffectOnce from "@hooks/useEffectOnce";
import ReportDetailModal from "./ReportDetailModal";
import Alert from "../../ui/alert/Alert";
import reducer, {
  addNotification,
  clearNotification,
} from "@redux/reducers/notifications/notification.reducer";
import { useDispatch } from "react-redux";

interface UserData {
  reportId: string;
  _id: string;
  uId: string;
  user: {
    _id: string;
    uId: string;
    image: string;
    username: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
  description: string;
}

export default function BasicTableOne() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const dispatch = useDispatch();
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsersReportAdminRole(
        currentPage
      );

      const rawUsers = response.data.reportusers;

      const mappedUsers: UserData[] = rawUsers.map((u: any) => ({
        reportId: u.reportProfileInfo._id,
        _id: u._id,
        uId: u.uId,
        user: {
          _id: u._id,
          uId: u.uId,
          image: u.profilePicture || "/default-avatar.jpg",
          username: u.username,
          role: "Member",
        },
        projectName: u.reportProfileInfo.reason || "No project",
        team: {
          images: [u.profilePicture || "/default-avatar.jpg"],
        },
        description: u.reportProfileInfo.description || "No description",
        status: u.reportProfileInfo.status,
        budget: new Date(u.reportProfileInfo.createdAt).toLocaleDateString(
          "vi-VN"
        ),
      }));

      setUsers(mappedUsers);
      setTotal(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  }, [currentPage]);

  const banUser = async (reportId: string, userId: string, reason: string) => {
    try {
      await userService.ChangeStatus({ reportId, status: "reviewed" });
      await userService.BanUser({ userId, reason });

      getAllUsers();
      dispatch(
              addNotification({
                message: "ban success",
                type: "success",
              })
            );
    } catch (error) {
      console.error("Ban user thất bại:", error);
      alert("Ban user thất bại");
    }
  };

  const accept = async (reportId: string, userId: string) => {
    try {
      await userService.ChangeStatus({ reportId, status: "reviewed" });

      getAllUsers();
      dispatch(
              addNotification({
                message: "Accept success",
                type: "success",
              })
            );
    } catch (error) {
      console.error("Ban user thất bại:", error);
      alert("Ban user thất bại");
    }
  };

  useEffectOnce(() => {
    getAllUsers();
  });

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full h-[350px] max-sm:max-h-[calc(100vh-350px)] overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reason
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Report Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((order) => (
              <TableRow
                key={order._id}
                onClick={() => setSelectedUser(order)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={order.user.image}
                        alt={order.user.username}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.username}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.projectName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "reviewed"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.budget}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation(); // không trigger click vào row
                        accept(order.reportId, order._id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); // không trigger click vào row
                        banUser(
                          order.reportId,
                          order._id,
                          order.projectName || "Vi phạm nội quy"
                        );
                      }}
                    >
                      Ban
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end p-4 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Chi tiết user */}
      {selectedUser && (
        <ReportDetailModal
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
