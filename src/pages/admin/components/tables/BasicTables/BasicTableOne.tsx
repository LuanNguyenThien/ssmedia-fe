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
  status: boolean;
  budget: string;
  email: string;

}

export default function BasicTableOne() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsersAdminRole(currentPage);
      const rawUsers = response.data.users;
      console.log("rawUsers", rawUsers);
      // Chuyển đổi dữ liệu từ API thành định dạng mong muốn

      const mappedUsers: UserData[] = rawUsers.map((u: any) => ({
        _id: u._id,
        user: {
          image: u.profilePicture || "/default-avatar.jpg",
          name: u.username,
          role: "Member", // hoặc dùng u.role nếu backend trả về
        },
        projectName: u.work || "No information",
        team: {
          images: [u.profilePicture || "/default-avatar.jpg"],
        },
        email : u.email,
        status: u.isBanned,

        budget: new Date(u.createdAt).toLocaleDateString(
          "vi-VN",) // có thể gán mặc định
      }));

      setUsers(mappedUsers);
      setTotal(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  }, [currentPage]);

  useEffectOnce(() => {
    getAllUsers();
  });

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full">
        {/* Table header cố định */}
        <table className="w-full table-fixed">
          <thead className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
            <tr>
              <th className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400">
                User
              </th>
              <th className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400">
                Work
              </th>
              <th className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400">
                Email
              </th>
              <th className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400">
                Status
              </th>
              <th className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400">
                Created At
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable body */}
      <div className="h-[350px] overflow-y-auto w-full">
        <table className="w-full table-fixed">
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((order) => (
              <tr key={order._id}>
                <td className="px-5 py-4 sm:px-6 text-start">
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
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.projectName}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.email}
                </td>
                <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={order.status === true ? "error" : "success"}
                  >
                    {order.status === true ? "Banned" : "Active"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.budget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
