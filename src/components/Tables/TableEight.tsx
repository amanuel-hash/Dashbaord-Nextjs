/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import Pagination from "../Pagination/pagination";
import useRecipeStore from "@/store/RecipeStore";
import { toast } from "react-toastify";
import useReviewStore from "../../store/reviewStore";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";
import { api } from "@/js/api";
import DeleteModal from "../modals/deleteCategory";
import { Trash2 } from "lucide-react";

const ReviewTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { getReviewbyId, reviewList = [], togglePublish, deleteReview,isLoading } = useReviewStore();
  const { recipes, getRecipe } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const totalPages = Math.ceil(reviewList.length / itemsPerPage);
  const { setLoading } = useContext(OverlayLoaderContext);

  const paginatedReviews = reviewList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchRecipes = async () => {
    try {
      await getRecipe();
    } catch (error) {
      console.error("Failed to fetch recipes", error);
      toast.error("Failed to fetch recipes");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (selectedRecipe) {
      const recipe = recipes.find((r: any) => r.title === selectedRecipe);
      if (recipe) {
        setCurrentPage(1);
        fetchRecipeReviewsById(recipe._id);
      }
    }
  }, [selectedRecipe]);

  const fetchRecipeReviewsById = async (id: string) => {
    try {
      setLoading(true);
      await getReviewbyId(id);
    } catch (err) {
      toast.error("Failed to fetch recipe reviews.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review: any) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (id: string) => {
      try {
        await deleteReview(id);
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error("Failed to delete review");
      } finally {
        setDeleteModalOpen(false);
        setSelectedReview(null);
      }

  };

const handleTogglePublish = async (id: string, isPublished: boolean) => {
  try {
    setLoading(true);
    await togglePublish(id, !isPublished);
  } catch (error) {
    toast.error("Failed to toggle publish status");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:bg-gray-dark">
      <div className="mb-4 flex items-center gap-3">
        <label className="whitespace-nowrap rounded-md bg-primary px-4 py-2 text-lg font-bold text-white">
          Select Recipe
        </label>
        <select
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-4 py-2 font-bold shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">-- Choose a recipe --</option>
          {recipes.map((recipe: any) => (
            <option key={recipe._id} value={recipe.title}>
              {recipe.title}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-[#F7F9FC] text-left text-primary">
            <th className="px-4 py-4 font-bold text-primary">Sr.No</th>
            <th className="px-4 py-4 font-bold text-primary">Title</th>
            <th className="px-4 py-4 font-bold text-primary">Reviewer</th>
            <th className="px-4 py-4 font-bold text-primary">Rating</th>
            <th className="px-4 py-4 font-bold text-primary">Review</th>
            <th className="px-4 py-4 font-bold text-primary">Published</th>
            <th className="px-4 py-4 font-bold text-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReviews.length > 0 ? (
            paginatedReviews.map((item: any, index: number) => (
              <tr key={item._id} className="border-b border-gray-200">
                <td className="px-4 py-3">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {item.recipeId?.title}
                </td>
                <td className="px-4 py-3">{item.userId?.email || "N/A"}</td>
                <td className="px-4 py-3">
                  <span className="text-primary">
                    {"★".repeat(item.rating)}
                    <span className="text-gray-300">
                      {"☆".repeat(5 - item.rating)}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={item.isPublished}
                      onChange={() =>
                        handleTogglePublish(item._id, item.isPublished)
                      }
                    />
                    <div className="peer h-5 w-10 rounded-full bg-red-600 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full"></div>
                  </label>
                </td>
                <td className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                No reviews found for this recipe.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DeleteModal
        isLoading={isLoading}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        item={selectedReview}
        onDelete={() => confirmDelete(selectedReview?._id)}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ReviewTable;
