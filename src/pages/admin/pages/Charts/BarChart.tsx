import StatisticsPost from "../../components/ecommerce/StatisticsPost";
import MonthlyPost from "../../components/ecommerce/MonthlyPost";
import PostsChart from "../../components/ecommerce/PostChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function BarChart() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="gap-4 md:gap-6">
        <div className="col-span-12 mb-4 space-y-6 xl:col-span-7">
          <StatisticsPost />

          <MonthlyPost/>
        </div>

        

        <div className="col-span-12">
          <PostsChart />
        </div>
      </div>
    </>
  );
}


