import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import React, { useState, useCallback, useEffect } from "react";
import { postService } from "@services/api/post/post.service";
import useEffectOnce from "@hooks/useEffectOnce";

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
      const response = await postService.GetHirePost(currentPage);
      console.log("response", response);
      const rawReports = response.data.hiddenPosts.posts;
      const mappedReports: ReportData[] = rawReports.map((r: any) => ({
        reportId: r._id,
        postId: r._id,
        user: {
          image: r.profilePicture || "/default-avatar.jpg",
          name: r.username,
          role: "Member",
        },
        content: r.hiddenReason,
        post: r.post,
        reportDate: new Date(r.hiddenAt).toLocaleDateString("vi-VN"),
      }));

      setReports(mappedReports);
      setTotal(response.data.hiddenPosts.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  }, [currentPage]);

  const UnHire = async (postId: string) => {
    try {
      await postService.UnHirePost({ postId });
      getAllReports();
    } catch (error) {
      console.error("Ban user thất bại:", error);
      alert("Ban user thất bại");
    }
  };

  useEffectOnce(() => {
    getAllReports();
  });

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <Table className="min-w-full table-fixed border-collapse">
          <TableHeader className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <TableRow className="dark:bg-gray-800 sticky top-0">
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs   dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs  dark:text-gray-400"
              >
                Post
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs  dark:text-gray-400"
              >
                Reason
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs  dark:text-gray-400"
              >
                HireDate
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs  dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-theme-xs "
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-theme-xs  text-gray-500"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.reportId}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  onClick={() => setSelectedReport(report)}
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-xs ">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={report.user.image}
                          alt={report.user.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90 text-theme-xs ">
                          {report.user.name}
                        </span>
                        <span className="block text-gray-500 dark:text-gray-400 text-theme-xs ">
                          {report.user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-xs  dark:text-gray-400">
                    <a
                      href={`/app/social/post/${report.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {report.post}
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-xs  dark:text-gray-400">
                    {report.content}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs  dark:text-gray-400">
                    {report.reportDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-xs ">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          UnHire(report.postId);
                        }}
                      >
                        UnHide
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end p-4 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-3 py-1 rounded text-theme-xs  ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            } hover:bg-blue-500 hover:text-white transition`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
