import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

// export const metadata: Metadata = {
//   title: "Next.js Organizations Page | NextAdmin - Next.js Dashboard Kit",
//   description: "This is Next.js Organizations page for NextAdmin Dashboard Kit",
// };

const SubscriptionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Subscriptions" />
      {/* Header Section with Button */}
      <div className="mb-5.5 flex items-center justify-between">
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Add New Subscription
        </button>
      </div>
      <div className="flex flex-col gap-10">
        {/* <TableOne />
        <TableTwo /> */}
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default SubscriptionsPage;
