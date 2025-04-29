import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { postService } from "@services/api/post/post.service";
import { userService } from "@/services/api/user/user.service";

type TabOption = "optionOne" | "optionTwo" | "optionThree";

export default function StatisticsChart() {
  const [selectedTab, setSelectedTab] = useState<TabOption>("optionOne");
  const [series, setSeries] = useState<any[]>([]);
  const [xCategories, setXCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedTab === "optionOne") {
          const response = await userService.GetStatisticUserperMonth();
          const data = response.data.data;
          console.log("response", data);
          const categories = data.map((item: any) => item._id);
          const totalUsers = data.map((item: any) => item.totalUsers);
          const bannedUsers = data.map((item: any) => item.bannedUsers);

          setXCategories(categories);
          setSeries([
            { name: "Total Users", data: totalUsers },
            { name: "Banned Users", data: bannedUsers },
          ]);
        } else if (selectedTab === "optionTwo") {
          const response = await userService.GetStatisticUserperyear();
          const data = response.data.data;
          console.log("response", data);
          const categories = data.map((item: any) => item.yearMonth);
          const totalUsers = data.map((item: any) => item.totalUsers);
          const bannedUsers = data.map((item: any) => item.bannedUsers);

          setXCategories(categories);
          setSeries([
            { name: "Total Users", data: totalUsers },
            { name: "Banned Users", data: bannedUsers },
          ]);
        } else if (selectedTab === "optionThree") {
          const dummyData = [
            { year: "2022", totalPosts: 1200, totalComments: 500 },
            { year: "2023", totalPosts: 1800, totalComments: 700 },
            { year: "2024", totalPosts: 2100, totalComments: 900 },
          ];
          const categories = dummyData.map((item) => item.year);
          const postCounts = dummyData.map((item) => item.totalPosts);
          const commentCounts = dummyData.map((item) => item.totalComments);

          setXCategories(categories);
          setSeries([
            { name: "Posts", data: postCounts },
            { name: "Comments", data: commentCounts },
          ]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

  const options: ApexOptions = {
    legend: { show: true, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: xCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {selectedTab === "optionOne" && "Posts & Comments per Month"}
            {selectedTab === "optionTwo" && "Users & Banned Users per Year"}
            {selectedTab === "optionThree" && "Posts & Comments per Year"}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Statistical view by{" "}
            {selectedTab === "optionOne"
              ? "Month"
              : selectedTab === "optionTwo"
              ? "year"
              : "year"}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab onSelect={setSelectedTab} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading chart...</div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      )}
    </div>
  );
}
