import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { postService } from "@services/api/post/post.service"; // Import API của bạn

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
        if (selectedTab === "optionTwo") {
          const response = await postService.GetStatisticPost();
          const data = response.data.data; // gọi API theo ngày
          // const data = response.data; // Gọi API theo ngày
          const categories = data.map((item: any) => item._id); // _id mới đúng!
          const postCounts = data.map((item: any) => item.totalPosts);
          // Vì không có totalComments trong API => mình có thể set commentCounts = mảng toàn 0 hoặc bỏ nó đi
          const commentCounts = data.map((item: any) => 0);

          setXCategories(categories);
          setSeries([
            { name: "TotalPosts", data: postCounts },
            { name: "HirePosts", data: commentCounts },
          ]);
        } else if (selectedTab === "optionOne") {
          
          const response = await postService.GetStatisticPostperMonth();
          const data = response.data.data; // gọi API theo tháng
          // const data = response.data; // Gọi API theo ngày
          const categories = data.map((item: any) => item._id); // _id mới đúng!
          const postCounts = data.map((item: any) => item.totalPosts);
          // Vì không có totalComments trong API => mình có thể set commentCounts = mảng toàn 0 hoặc bỏ nó đi
          const commentCounts = data.map((item: any) => 0);

          setXCategories(categories);
          setSeries([
            { name: "TotalPosts", data: postCounts },
            { name: "HirePosts", data: commentCounts },
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
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 ">
            {selectedTab === "optionOne" && "Posts & Comments per Month"}
            {selectedTab === "optionTwo" && "Posts & Comments per Year"}
            {selectedTab === "optionThree" && "Posts & Comments per Year"}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm ">
            Statistical view by{" "}
            {selectedTab === "optionOne"
              ? "month"
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
