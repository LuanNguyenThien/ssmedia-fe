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
import { useDispatch } from "react-redux";
import { addNotification } from "@redux/reducers/notifications/notification.reducer";
import { useNavigate } from "react-router-dom";
import { ProfileUtils } from "@services/utils/profile-utils.service";

interface UserData {
  _id: string;
  reportId: string;
  user: {
    _id: string;
    uId: string;
    image: string;
    username: string;
    role: string;
  };
  userreport: {
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
  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsersReportAdminRole(
        currentPage
      );

      const rawUsers = response.data.reportusers;
      const mappedUsers: UserData[] = rawUsers.map((u: any) => ({
        _id: u._id,
        reportId: u._id,
        user: {
          _id: u.reporter._id,
          uId: u.reporter.uId,
          image: u.reporter.profilePicture || "/default-avatar.jpg",
          username: u.reporter.username,
          role: "Member",
        },
        userreport: {
          _id: u.reportedUser._id,
          uId: u.reportedUser.uId,
          image: u.reportedUser.profilePicture || "/default-avatar.jpg",
          username: u.reportedUser.username,
          role: "Member",
        },
        projectName: u.reason || "No project",
        team: {
          images: [u.profilePicture || "/default-avatar.jpg"],
        },
        description: u.description || "No description",
        status: u.status || "pending",
        budget: new Date(u.createdAt).toLocaleDateString("vi-VN"),
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
      await getAllUsers();
      dispatch(
        addNotification({
          message: "Ban success",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Ban user thất bại:", error);
      alert("Ban user thất bại");
    }
  };

  const accept = async (reportId: string) => {
    try {
      await userService.ChangeStatus({ reportId, status: "reviewed" });
      await getAllUsers();
      dispatch(
        addNotification({
          message: "Accept success",
          type: "success",
        })
      );
    } catch (error) {
      console.error("Accept thất bại:", error);
      alert("Accept thất bại");
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
      <div className="max-w-full">
        {/* Đặt header và body trong cùng 1 bảng */}
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reporter User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reported User
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

          {/* Phần này giới hạn chiều cao + scroll cho tbody */}
          <TableBody
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
           
          >
            {loading ? (
              <tr
                style={{
                  display: "table",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <td colSpan={6} className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr
                style={{
                  display: "table",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <td colSpan={6} className="text-center py-5">
                  No reports found.
                </td>
              </tr>
            ) : (
              users.map((order) => (
                <TableRow
                  key={order._id}
                  onClick={() => {}}
                  className="cursor-default"
                  
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div
                      className="flex items-center gap-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        ProfileUtils.navigateToProfileAdmin(order.user);
                      }}
                    >
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

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div
                      className="flex items-center gap-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        ProfileUtils.navigateToProfileAdmin(order.userreport);
                      }}
                    >
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={order.userreport.image}
                          alt={order.userreport.username}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.userreport.username}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.userreport.role}
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
                          e.stopPropagation();
                          accept(order.reportId);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          banUser(
                            order.reportId,
                            order.userreport._id,
                            order.projectName || "Vi phạm nội quy"
                          );
                        }}
                      >
                        Ban
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end p-4">
        <nav>
          <ul className="inline-flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
