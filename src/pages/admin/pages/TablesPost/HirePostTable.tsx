import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ReportPostTableOne from "../../components/tables/ReportPostTable/ReportPostTableOne";
import HiddenPostTable from "../../components/tables/HirePostTables/HirePostTableOne";
export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Hire Post Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Hire Post Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Hire Post" />
      <div className="space-y-6">
        <ComponentCard title="Hire Post">
          <HiddenPostTable />
        </ComponentCard>
      </div>
    </>
  );
}
