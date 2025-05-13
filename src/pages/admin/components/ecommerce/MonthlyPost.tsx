import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { FaEllipsisH as MoreDotIcon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { postService } from "@services/api/post/post.service";

export default function YearlyPostsChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchYearlyData() {
      try {
        const res = await postService.GetStatisticPostperyear(); // API thống kê theo tháng
        const rawData = res.data.data;

        // Lọc trùng nếu cần
        const uniqueData = Array.from(
          new Map(rawData.map((item: any) => [item.yearMonth, item])).values()
        );

        // Sắp xếp theo thời gian tăng dần
        const sortedData = uniqueData.sort(
          (a: any, b: any) =>
            new Date(a.yearMonth).getTime() - new Date(b.yearMonth).getTime()
        );

        const labels = sortedData.map((item: any) => {
          const [year, month] = item.yearMonth.split("-");
          return `${month}/${year}`;
        });

        const totals = sortedData.map((item: any) => item.totalPosts);

        setCategories(labels); // ["04/2024", "05/2024", ...]
        setDataPoints(totals); // [0, 0, ..., 121, ...]
      } catch (err) {
        console.error("Failed to fetch yearly stats", err);
      }
    }

    fetchYearlyData();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { text: undefined } },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} posts`,
      },
    },
  };

  const series = [
    {
      name: "Total Posts",
      data: dataPoints,
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5  sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Yearly Posts
        </h3>
        <div className="relative inline-block">
          <button
            className="dropdown-toggle"
            onClick={toggleDropdown}
            aria-label="Open chart menu"
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700  size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={200} />
        </div>
      </div>
    </div>
  );
}
