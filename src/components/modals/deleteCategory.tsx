import React from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface DeleteModalProps {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  item: {
    _id?: string;
    id?: string;
    title?: string;
    name?: string;
  } | null;
  onDelete: (id: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  item,
  onDelete,
}) => {
  if (!isOpen || !item) return null;
  const label = item.title || item.name;
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[#e63946] hover:text-black"
        >
          <X />
        </button>

        {/* Heading */}
        <h2 className="mb-4 text-center text-xl font-bold text-primary">
          Confirm Delete
        </h2>

        {/* Message */}
        <p className=" mb-6 text-center text-gray-700">
          Are you sure you want to delete {""}
          <strong>{label ? label : "this item"}</strong>?
        </p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onDelete.bind(null, item._id || item.id || "")}
            disabled={isLoading}
            className="min-w-[80px] rounded bg-red-600 px-4 py-2 text-white transition-colors  disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
