import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { postService } from "@services/api/post/post.service";
import { useEffect, useState } from "react";
export default function LineChartOne() {
  const [series, setSeries] = useState([
    { name: "Total Posts", data: [] as number[] },
    { name: "Hidden Posts", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "yyyy-MM-dd" },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: { fontSize: "0px" },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await postService.GetStatisticPost();
        const resData = await postService.GetStatisticPostperMonth();
        const data = res.data.data; // [{ _id: '2025-04-23', totalPosts: 10, hiddenPosts: 2 }, ...]

        const labels = data.map((item: any) => item._id);
        const totalPosts = data.map((item: any) => item.totalPosts);
        const hiddenPosts = data.map((item: any) => item.hiddenPosts);

        setCategories(labels);
        setSeries([
          { name: "Total Posts", data: totalPosts },
          { name: "Hidden Posts", data: hiddenPosts },
        ]);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
