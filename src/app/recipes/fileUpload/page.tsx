"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineCloudUpload } from "react-icons/ai";
import { toast } from "react-toastify";

const FileUploadPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { setLoading } = useContext(OverlayLoaderContext);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("It's required to select a file before uploading.");
      return;
    }
    // toast.success(`Uploading: ${selectedFile.name}`);
    toast.success(
      "Implementation in progress. Please wait for the next update.",
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        paths={[
          { name: "Dashboard", href: "/" },
          { name: "Recipes", href: "/recipes" },
          { name: "Upload Recipe" },
        ]}
      />

      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-center text-4xl font-bold text-red-600">
            {"Upload CSV File"}
          </h2>
          <p className="text-md mb-6 text-center text-gray-500">
            Select a CSV file to upload your recipes. Only <code>.csv</code>{" "}
            files are allowed.
          </p>

          {/* Upload box */}
          <label
            htmlFor="fileUpload"
            className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-[#48a64b] hover:bg-[#f6fff6]"
          >
            <AiOutlineCloudUpload size={50} className="mb-3 text-[#48a64b]" />
            <span className="font-medium text-gray-700">
              {selectedFile ? selectedFile.name : "Select a CSV file to upload"}
            </span>
            <span className="mt-1 text-sm text-gray-400">
              or drag and drop it here
            </span>
            <input
              id="fileUpload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              className="rounded-lg bg-[#48a64b] px-8 py-4 font-medium text-white transition-colors hover:bg-[#3d8b40]"
            >
              Upload CSV File
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FileUploadPage;
