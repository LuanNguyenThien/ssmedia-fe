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
import useEffectOnce from "@hooks/useEffectOnce";
import { Link } from "react-router-dom";

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
  post: string;
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
      const rawReports = response.data.reportposts.reportposts;
      ;
      console.log("rawReports", rawReports);
      const mappedReports: ReportData[] = rawReports.map((r: any) => ({
        reportId: r.report._id,
        postId: r.report.postId,
        user: {
          image: r.post.profilePicture ? r.post.profilePicture : "/default-avatar.jpg",
          name: r.post.username,
          role: "Member",
        },
        content: r.report.content,
        post: r.post.post,
        status: r.report.status,
        reportDate: new Date(r.report.createdAt).toLocaleDateString("vi-VN"),
      }));

      setReports(mappedReports);
      setTotal(response.data.reportposts.total);
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

  const hirePost = async (reportId: string, postId: string, reason: string) => {
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
      console.error("Duyệt thất bại:", error);
      alert("Duyệt thất bại");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white ">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <Table className="table-fixed min-w-full">
          <TableHeader className="border-b border-gray-100 ">
            <TableRow>
              <TableCell
                isHeader
                className="w-[180px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="w-[150px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                Post
              </TableCell>
              <TableCell
                isHeader
                className="w-[200px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                Reasion
              </TableCell>
              <TableCell
                isHeader
                className="w-[120px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="w-[150px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                Report Date
              </TableCell>
              <TableCell
                isHeader
                className="w-[200px] px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable Table Body */}
      <div className="max-h-[350px] overflow-y-auto overflow-x-auto">
        <Table className="table-fixed min-w-full">
          <TableBody className="divide-y divide-gray-100 ">
            {reports.map((report) => (
              <TableRow
                key={report.reportId}
                onClick={() => setSelectedReport(report)}
                className="cursor-pointer hover:bg-gray-50 "
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
                      <span className="block font-medium text-gray-800 text-theme-sm ">
                        {report.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs ">
                        {report.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm ">
                  <a
                    href={`/app/social/post/${report.postId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {report.post}
                  </a>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm ">
                  {report.content}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm ">
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

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm ">
                  {report.reportDate}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
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
                          report.reportId,
                          report.postId,
                          report.content
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
    </div>
  );
  
}
