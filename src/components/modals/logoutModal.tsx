import React from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const LogoutModal = ({ isOpen, onClose, onLogout, isLoading }: any) => {
  const router = useRouter();
  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
    toast.success("You have been logged out successfully.");
    router.push("/auth/signin");
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X />
        </button>

        <h2 className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-white">
          Confirm Logout
        </h2>

        <p className="mb-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to log out from your account?
        </p>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 dark:bg-gray-600 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex cursor-pointer items-center justify-center  gap-2 rounded bg-red-600 px-4 py-2 font-medium   text-white transition hover:bg-red-700 hover:bg-opacity-90"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Logging out...
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
