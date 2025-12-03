import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
    company: string;
    status: string;
  } | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close only if user clicks on the overlay, not on the modal box itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick} // <<== ADD THIS
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // <<== PREVENTS propagation
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-red-600"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-primary">User Details</h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar}
              alt={user.name}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <p className="text-md font-medium text-gray-800">Profile Image</p>
            </div>
          </div>

          <div className="text-md space-y-2 text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Name:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Company:</span>{" "}
              {user.company}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Status:</span>{" "}
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
