"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableFour from "@/components/Tables/TableFour";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useContext, useEffect } from "react";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

const ClientsPage = () => {
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
        paths={[{ name: "Dashboard", href: "/" }, { name: "Feedback" }]}
      />
      <div className="flex flex-col gap-10">
        <TableFour />
      </div>
    </DefaultLayout>
  );
};

export default ClientsPage;
