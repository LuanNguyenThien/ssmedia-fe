import StatisticsUser from "../../components/ecommerce/StatisticsUser";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import UserChart from "../../components/ecommerce/UserChart";
import PageMeta from "../../components/common/PageMeta";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 mb-5  xl:col-span-7">
          <StatisticsUser />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12">
          <UserChart />
        </div>
      </div>
    </>
  );
}
