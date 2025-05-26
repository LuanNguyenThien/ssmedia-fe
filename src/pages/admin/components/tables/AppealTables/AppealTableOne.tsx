import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import Badge from "../../ui/badge/Badge";
import React, { useState, useCallback, useEffect } from "react";
import { userService } from "@services/api/user/user.service";
import useEffectOnce from "@hooks/useEffectOnce";
import reducer, {
  addNotification,
  clearNotification,
} from "@redux/reducers/notifications/notification.reducer";
import { useDispatch } from "react-redux";

interface UserData {
  user: {
    _id: string;
    uId?: string;
    image: string;
    username: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  appealId: string;
  status: string;
  banAt: string;
}

export default function BanUserTableOne() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);
  const dispatch = useDispatch();

  // Modal state
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userService.getAllAppeal(currentPage);
      const rawUsers = response.data.data;

      const mappedUsers: UserData[] = rawUsers.map((u: any) => ({
        user: {
          _id: u._id,
          uId: u.uId,
          image: u.profilePicture || "/default-avatar.jpg",
          username: u.username,
          role: "Member",
        },
        appealId: u.appeal._id,
        projectName: u.appeal.content || "No project",
        team: {
          images: [u.profilePicture || "/default-avatar.jpg"],
        },
        status: u.appeal.status,
        banAt: new Date(u.appeal.createdAt).toLocaleDateString("vi-VN"),
      }));

      setUsers(mappedUsers);

      setTotal(response.data.pagination.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  }, [currentPage]);

  const UnbanUser = async (
    appealId: string,
    userId: string,
    reason: string
  ) => {
    try {
      await userService.ChangeStatusAppeal({ appealId, status: "reviewed" });
      await userService.UnBanUser({ userId, reason });
      dispatch(
        addNotification({
          message: "Unban success",
          type: "success",
        })
      );
      getAllUsers();
    } catch (error) {
      console.error("Ban user thất bại:", error);
      alert("Ban user thất bại");
    }
  };

  const accept = async (appealId: string, userId: string) => {
    try {
      await userService.ChangeStatusAppeal({
        appealId,
        status: "reviewed",
      });

      getAllUsers();
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

  // Mở modal hiển thị chi tiết user
  const openUserModal = (user: UserData) => {
    setSelectedUser(user);
    console.log("Selected user:", user);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-h-[420px] overflow-y-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
              >
                Reason
              </TableCell>
              <TableCell
                isHeader
                className="px-5 w-[150px] py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 w-[150px] font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
              >
                Appeal Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((order) => (
              <TableRow
                key={order.appealId}
                onClick={() => openUserModal(order)}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
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
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  {order.projectName}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
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
                <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                  {order.banAt}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <button
                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      UnbanUser(
                        order.appealId,
                        order.user._id,
                        order.projectName || "Vi phạm nội quy"
                      );
                    }}
                  >
                    Unban
                  </button>
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

      {/* Modal */}

      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng modal */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl"
            >
              ×
            </button>

            {/* Phần header: avatar + tên + role */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedUser.user.image}
                alt={selectedUser.user.username}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {selectedUser.user.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.user.role}
                </p>
              </div>
            </div>

            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lý do báo cáo
              </label>
              <textarea
                value={selectedUser.projectName || ""}
                rows={4} 
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white resize-none"
                disabled
              />
            </div>

            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  // Giả sử có hàm ProfileUtils.navigateToProfileAdmin
                  ProfileUtils.navigateToProfileAdmin(selectedUser.user);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Profile
              </button>

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
