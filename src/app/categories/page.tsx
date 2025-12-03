"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableSeven from "@/components/Tables/TableSeven";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryModal from "@/components/modals/category";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

const ClientsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const router = useRouter();

  const handleAdd = () => {
    setSelectedItem(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleSave = (data: any) => {};
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
        paths={[{ name: "Dashboard", href: "/" }, { name: "Categories" }]}
      />
      <div className="mb-6 flex justify-end">
        <div className=" flex items-center justify-between">
          <button
            onClick={handleAdd}
            className="rounded-lg bg-[#48a64b] px-6 py-3 font-medium text-white"
          >
            Add New Category
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <TableSeven />
      </div>

      <CategoryModal
        isOpen={modalOpen}
        mode={modalMode}
        item={selectedItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </DefaultLayout>
  );
};

export default ClientsPage;
