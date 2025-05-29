import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BanUserTableOne from "../../components/tables/BanUserTables/BanUserTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Ban User" />
      <div className="space-y-6">
        <ComponentCard title="Ban User">
          <BanUserTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
