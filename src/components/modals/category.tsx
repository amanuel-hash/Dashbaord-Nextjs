/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { DatabaseIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import useCategoryStore from "../../store/categoryStore";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  item: {
    _id?: string;
    id?: string;
    title?: string;
    name?: string;
    description?: string;
    image?: string;
    imageUrl?: string;
    imageURL?: string;
  } | null;
  onSave: (updatedItem: any) => void;
}

const CategoryModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  mode,
  item,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [hasNewImage, setHasNewImage] = useState(false);
  const { createCategory, isLoading, updateCategory } = useCategoryStore();

  useEffect(() => {
    if (item && mode === "edit") {
      setTitle(item.name || item.title || "");
      const existingImage = item.image || item.imageUrl || item.imageURL || "";
      setImage(existingImage);
      setImageUrl(existingImage);
      setHasNewImage(false);
    } else if (mode === "add") {
      resetForm();
    }
  }, [item, mode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG and JPEG images are allowed.");
        return;
      }
      setImage(file);
      setHasNewImage(true);
      setImageUrl(""); // Clear URL when new file is selected
    }
  };
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Name is required.");
      return;
    }

    // For add mode, require either image file or URL
    if (mode === "add" && !image && !imageUrl) {
      toast.error("Image is required.");
      return;
    }

    try {
      if (mode === "add") {
        const formData = new FormData();
        formData.append("name", title);

        if (image instanceof File) {
          formData.append("image", image);
        } else if (imageUrl) {
          formData.append("imageUrl", imageUrl);
        }

        const response = await createCategory(formData);
        if (response?.data?.success) {
          resetForm();
          onClose?.();
        } else {
          toast.error(response?.data?.message || "Failed to add category.");
        }
      } else if (mode === "edit") {
        const hasNameChanged = title !== (item?.name || item?.title || "");
        const hasImageChanged =
          hasNewImage ||
          imageUrl !== (item?.image || item?.imageUrl || item?.imageURL || "");

        if (!hasNameChanged && !hasImageChanged) {
          toast.info("No changes detected.");
          onClose?.();
          return;
        }

        if (updateCategory && item?._id) {
          const formData = new FormData();
          if (hasNameChanged) {
            formData.append("name", title);
          }

          // Only send image if it's a new file upload
          if (hasNewImage && image instanceof File) {
            formData.append("image", image);
          } else if (
            imageUrl &&
            imageUrl !== (item?.image || item?.imageUrl || item?.imageURL)
          ) {
            formData.append("imageUrl", imageUrl);
          }

          const response = await updateCategory(item._id, formData);
          if (response?.data?.success) {
            const updatedItem = {
              ...(item || {}),
              name: title,
              title: title,
              image:
                hasNewImage && image instanceof File
                  ? response.data.imageUrl
                  : imageUrl || image,
            };
            onSave(updatedItem);
            toast.success(`"${title}" updated successfully.`);
            resetForm();
            onClose?.();
          } else {
            toast.error(
              response?.data?.message || "Failed to update category.",
            );
          }
        } else {
          // Fallback to onSave callback for local updates
          const updatedItem = {
            ...(item || {}),
            name: title,
            title: title,
            image: image,
          };
          onSave(updatedItem);
          toast.success(`"${title}" updated successfully.`);
          resetForm();
          onClose?.();
        }
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(
        err?.response?.data?.message ||
          `Failed to ${mode === "add" ? "add" : "update"} category.`,
      );
    }
  };

  const resetForm = () => {
    setTitle("");
    setImage("");
    setImageUrl("");
    setHasNewImage(false);
  };

  if (!isOpen) return null;
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      resetForm();
    }
  };
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute right-5 top-5 text-[#e63946] hover:text-black"
          disabled={isLoading}
        >
          <X />
        </button>

        <h2 className="mb-2 text-center text-2xl font-semibold text-primary">
          {mode === "add" ? "Add New Category" : `Edit ${"Category"}`}
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-lg font-bold text-primary">
              Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Enter category name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-1 block text-lg font-bold text-primary">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
              className="w-full rounded border px-3 py-2 text-sm"
              disabled={isLoading}
            />
          </div>

          {(image || imageUrl) && (
            <div className="mt-2">
              <div className="flex justify-center">
                <img
                  src={
                    image instanceof File
                      ? URL.createObjectURL(image)
                      : imageUrl || (typeof image === "string" ? image : "")
                  }
                  alt="Preview"
                  className="mb-3 h-[120px] w-[120px] max-w-xs rounded-lg border border-gray-300 object-cover shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    toast.error("Failed to load image");
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[80px] rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
