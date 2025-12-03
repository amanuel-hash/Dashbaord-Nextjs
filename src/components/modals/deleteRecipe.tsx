/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X } from "lucide-react";

interface DeleteModalProps {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    _id?: string;
    id?: string;
    title?: string;
    name?: string;
    thumbnailImage?: string;
  } | null;
  onDelete: (id: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  recipe,
  onDelete,
}) => {
  if (!isOpen || !recipe) return null;

  const displayTitle = recipe.title || recipe.name || "this recipe";
  const recipeId = recipe._id || recipe.id || "";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#e43946] hover:text-black"
        >
          <X />
        </button>

        <h2 className="mb-4 text-center text-xl font-bold text-primary">
          Confirm Delete
        </h2>

        <p className="mb-6 text-center text-gray-700">
          Are you sure you want to delete <strong>{displayTitle}</strong>?
        </p>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(recipeId)}
            disabled={isLoading}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors  disabled:cursor-not-allowed disabled:opacity-50"
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
