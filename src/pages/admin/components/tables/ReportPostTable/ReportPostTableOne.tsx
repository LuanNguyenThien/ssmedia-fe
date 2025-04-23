import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import React, { useState, useCallback, useEffect } from "react";
import { postService } from "@services/api/post/post.service"; 
import { userService } from "@services/api/user/user.service";// Giả sử bạn có service để lấy báo cáo
import useEffectOnce from "@hooks/useEffectOnce";
// import ReportDetailModal from "./ReportDetailModal";
import Alert from "../../ui/alert/Alert";

interface ReportData {
  reportId: string;
  postId: string;
  user: {
    image: string;
    name: string;
    role: string;
  };
  content: string;
  status: string;
  reportDate: string;
  post : string;
}

export default function BasicTableOne() {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(5);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const getAllReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getAllReportPost(currentPage);
      console.log("response", response);
      const rawReports = response.data.reportposts; // Giả sử bạn nhận được dữ liệu báo cáo trong mảng 'reports'
    console.log("rawReports", rawReports);
      const mappedReports: ReportData[] = rawReports.map((r: any) => ({
        reportId: r.report._id,
        postId: r.report.postId,
        user: {
          image: r.post.profilePicture || "/default-avatar.jpg",
          name: r.post.username,
          role: "Member", // Tùy chỉnh nếu cần lấy thêm thông tin về role
        },
        content: r.report.content,
        post: r.post.post,
        status: r.report.status,
        reportDate: new Date(r.report.createdAt).toLocaleDateString("vi-VN"),
      }));

      setReports(mappedReports);
      setTotal(response.data.totalReports); // Giả sử bạn có tổng số báo cáo
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  }, [currentPage]);

  useEffectOnce(() => {
    getAllReports();
  });

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const hirePost = async (reportId: string ,postId: string, reason: string) => {
      try {
        await postService.ChangeStatus({ reportId, status: "reviewed" });
        await postService.HirePost({ postId, reason });
        
        getAllReports();
      } catch (error) {
        console.error("Ban user thất bại:", error);
        alert("Ban user thất bại");
      }
    };
  
    const accept = async (reportId: string) => {
      try {
        await postService.ChangeStatus({ reportId, status: "reviewed" });
       
        getAllReports();
      } catch (error) {
        console.error("Ban user thất bại:", error);
        alert("Ban user thất bại");
      }
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
                Post
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Reasion
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
            {reports.map((report) => (
              <TableRow
                key={report.reportId}
                onClick={() => setSelectedReport(report)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={report.user.image}
                        alt={report.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {report.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {report.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.post}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.content}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      report.status === "reviewed"
                        ? "success"
                        : report.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {report.reportDate}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation(); // không trigger click vào row
                        accept(report.reportId);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        hirePost(
                          report.reportId, report.postId, report.content
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

      {/* Chi tiết báo cáo */}
      {/* {selectedReport && (
        <ReportDetailModal
          selectedReport={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )} */}
    </div>
  );
}
