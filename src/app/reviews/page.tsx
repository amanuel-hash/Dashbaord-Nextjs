"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableEight from "@/components/Tables/TableEight";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

const ClientsPage = () => {
  const router = useRouter();

  const { setLoading } = useContext(OverlayLoaderContext);
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb
        paths={[
          { name: "Dashboard", href: "/" },
          { name: "Reviews & Ratings" },
        ]}
      />{" "}
      <div className="mb-5.5 flex items-center justify-between"></div>
      <div className="flex flex-col gap-10">
        <TableEight />
      </div>
    </DefaultLayout>
  );
};

export default ClientsPage;
