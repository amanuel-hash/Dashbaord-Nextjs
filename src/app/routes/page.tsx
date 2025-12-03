import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Routes Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Routes page for NextAdmin Dashboard Kit",
};

const RoutesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Routes" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default RoutesPage;
