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

interface UserData {
  _id: string;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

export default function BanUserTableOne() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllBanUsersAdminRole(currentPage);
      const rawUsers = response.data.data;

      const mappedUsers: UserData[] = rawUsers.map((u: any) => ({
        _id: u._id,
        user: {
          image: u.profilePicture || "/default-avatar.jpg",
          name: u.username,
          role: "Member",
        },
        projectName: u.work || "No project",
        team: {
          images: [u.profilePicture || "/default-avatar.jpg"],
        },
        status: "Active",
        budget: "$1,000",
      }));

      setUsers(mappedUsers);
      setTotal(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  }, [currentPage]);

  const UnbanUser = async (userId: string, reason: string) => {
      try {
        // await userService.ChangeStatus({ reportId, status: "reviewed" });
        await userService.UnBanUser({ userId, reason });
        // alert("Ban user thành công");
        getAllUsers(); // gọi lại API để cập nhật danh sách
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
                Project Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Team
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
                Budget
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
              <TableRow key={order._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.name}
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
                  <div className="flex -space-x-2">
                    {order.team.images.map((teamImage, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                      >
                        <img
                          width={24}
                          height={24}
                          src={teamImage}
                          alt={`Team member ${index + 1}`}
                          className="w-full size-6"
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Active"
                        ? "success"
                        : order.status === "Pending"
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
                  <button
                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    onClick={(e) => {
                      e.stopPropagation(); // không trigger click vào row
                      UnbanUser(
                       
                        order._id,
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
    </div>
  );
}
