import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ReportUserTableOne from "../../components/tables/UserTables/ReportUserTableOne";
import ReportPostTableOne from "../../components/tables/ReportPostTable/ReportPostTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Report Post" />
      <div className="space-y-6">
        <ComponentCard title="Report Post">
          <ReportPostTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
