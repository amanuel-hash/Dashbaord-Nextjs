/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X } from "lucide-react";

const RecipeModal = ({ isOpen, onClose, recipe, onEdit, onDelete }: any) => {
  if (!isOpen || !recipe) return null;

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
      <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-red-600 focus:outline-none"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="mb-4 text-center text-3xl font-bold text-primary">
          {recipe.title}
        </h2>

        {/* Image */}
        {recipe.thumbnailImage && (
          <img
            src={recipe.thumbnailImage}
            alt={recipe.title}
            className="mb-6 h-48 w-full rounded-md object-cover"
          />
        )}

        {/* Info Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-black">
          <p><strong>Description:</strong> {recipe.description || "N/A"}</p>
          <p><strong>Overview:</strong> {recipe.overview || "N/A"}</p>
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Category:</strong> {recipe.category?.name}</p>
          <p><strong>Cooking Time:</strong> {recipe.cookingTime} mins</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
          <p><strong>Difficulty Level:</strong> {recipe.level}</p>
          <p><strong>Favorite:</strong> {recipe.is_favorite ? "Yes" : "No"}</p>
          <p><strong>Cooking Tips:</strong> {recipe.cookingTips || "N/A"}</p>
          <p><strong>Nutritional Value:</strong> {recipe.nutritionalValue || "N/A"}</p>
        </div>

        {/* Ingredients & Equipment */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-black">
          <div>
            <strong>Ingredients:</strong>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
              {recipe.ingredients?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Equipment:</strong>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
              {recipe.equipment?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6 text-black">
          <strong>Steps:</strong>
          <ol className="mt-1 list-decimal pl-5 text-sm text-gray-700 space-y-2">
            {recipe.steps?.map((step: any, idx: number) => (
              <li key={idx}>
                <p className="font-semibold">{step.title}</p>
                <p>{step.description}</p>
                {step.imageUrl && (
                  <img
                    src={step.imageUrl}
                    alt={`Step ${idx + 1}`}
                    className="mt-1 rounded-md h-32 object-cover"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Videos */}
        <div className="mb-6 text-black">
          <strong>Recipe Videos:</strong>
          {recipe.videoUrls?.length ? (
            <div className="mt-2 space-y-4">
              {recipe.videoUrls.map((url: string, idx: number) => (
                <video
                  key={idx}
                  src={url}
                  controls
                  className="w-full max-h-64 rounded-md"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-700 mt-1">No videos available</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => onEdit(recipe._id)}
            className="rounded bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(recipe._id)}
            className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
