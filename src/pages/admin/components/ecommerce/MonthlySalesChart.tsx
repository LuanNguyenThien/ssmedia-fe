import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { FaEllipsisH as MoreDotIcon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { userService } from "@services/api/user/user.service";

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState<number[]>([]);
  const [bannedUsers, setBannedUsers] = useState<number[]>([]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await userService.GetStatisticUserperyear();
        const data = response.data.data;
        console.log("Thống kê người dùng:", data);

        const monthlyStats: Record<string, { total: number; banned: number }> =
          {};

        for (const item of data) {
          const month = item.yearMonth; // ✅ Đã sửa: dùng đúng key từ API
          if (!monthlyStats[month]) {
            monthlyStats[month] = { total: 0, banned: 0 };
          }
          monthlyStats[month].total += item.totalUsers;
          monthlyStats[month].banned += item.bannedUsers;
        }

        const sortedMonths = Object.keys(monthlyStats).sort();

        setCategories(
          sortedMonths.map((m) => {
            const [year, month] = m.split("-");
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            return `${monthNames[+month - 1]} ${year}`;
          })
        );

        setTotalUsers(sortedMonths.map((m) => monthlyStats[m].total));
        setBannedUsers(sortedMonths.map((m) => monthlyStats[m].banned));
      } catch (err) {
        console.error("Lỗi lấy thống kê người dùng:", err);
      }
    }

    fetchChartData();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "75%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => `${val} users` },
    },
  };

  const series = [
    { name: "Total Users", data: totalUsers },
    { name: "Banned Users", data: bannedUsers },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Users</h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg font-normal text-left w-full"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg font-normal text-left w-full"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
