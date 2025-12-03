"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableSix from "@/components/Tables/TableSix";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";
import { FaChevronDown } from "react-icons/fa";

const ClientsPage = () => {
  const router = useRouter();
  const { setLoading } = useContext(OverlayLoaderContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (mode: "form" | "csv") => {
    setIsOpen(false);
    if (mode === "form") router.push("/recipes/addRecipe");
    else router.push("/recipes/fileUpload");
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        paths={[{ name: "Dashboard", href: "/" }, { name: "Recipes" }]}
      />
      <div className="mb-6 flex justify-end">
        <div ref={dropdownRef} className="relative inline-block text-left">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-md inline-flex items-center gap-2 rounded-lg bg-[#48a64b] px-7 py-3 font-medium text-white shadow-sm transition hover:bg-[#3d8b40]"
          >
            Add New Recipes <FaChevronDown className="text-xs" />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="py-2">
                <button
                  onClick={() => handleSelect("form")}
                  className="text-md block w-full px-4 py-2 text-left text-black transition hover:bg-gray-100"
                >
                  📝 Add Recipe via Form
                </button>
                <button
                  onClick={() => handleSelect("csv")}
                  className="text-md block w-full px-4 py-2 text-left text-black transition hover:bg-gray-100"
                >
                  📁 Upload Recipe via CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <TableSix />
      </div>
    </DefaultLayout>
  );
};

export default ClientsPage;
