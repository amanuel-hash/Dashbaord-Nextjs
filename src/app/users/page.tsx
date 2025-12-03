"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableFive from "@/components/Tables/TableFive";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";
import { useContext, useEffect } from "react";

const Users = () => {
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
        paths={[{ name: "Dashboard", href: "/" }, { name: "Users" }]}
      />
      <div className="flex flex-col gap-10">
        <TableFive />
      </div>
    </DefaultLayout>
  );
};

export default Users;
