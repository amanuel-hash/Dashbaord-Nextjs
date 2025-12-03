/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import { Delete, Eye, Pencil, Trash2 } from "lucide-react";
import RecipeModal from "../modals/ViewRecipe";
import DeleteModal from "../modals/deleteRecipe";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination/pagination";
import useRecipeStore from "../../store/RecipeStore";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

const itemsPerPage = 10;
const TableFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { recipes, getRecipe, deleteRecipe, isLoading, recommend } =
    useRecipeStore();
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = recipes.slice(startIndex, startIndex + itemsPerPage);
  const [modalOpen, setModalOpen] = useState(false);
  type Recipe = {
    _id: string;
    title: string;
    cuisine: string;
    category: string;
    cookingTime: number;
    servings: number;
    is_favorite: boolean;
    createdAt: string;
    thumbnailImage: string;
  };
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { setLoading } = useContext(OverlayLoaderContext);

  const fetchRecipes = async () => {
    try {
      await getRecipe();
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to fetch categories");
    }
  };
  useEffect(() => {
    fetchRecipes();
  }, []);
  const handleView = (id: string) => {
    const found = recipes.find((r: Recipe) => r._id === id);
    setSelectedRecipe(found ?? null);
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const recipe = recipes.find((r: Recipe) => r._id === id);
    if (recipe) {
      const encoded = encodeURIComponent(JSON.stringify(recipe));
      router.push(`/recipes/addRecipe?mode=edit&data=${encoded}`);
    }
  };

  const handleDelete = (id: string) => {
    const found = recipes.find((r: Recipe) => r._id === id);
    setSelectedRecipe(found ?? null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteModalOpen(false);
      setSelectedRecipe(null);
    }
  };
  const handleToggleRecommended = async (id: string, index: number) => {
    const updated = [...recipes];
    const newStatus = !updated[index].is_favorite;
    setLoading(true);
    try {
      await recommend(id, newStatus);
    } catch (error) {
      toast.error("Failed to update recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-1d rounded-[10px] border border-stroke bg-white p-4 sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left text-primary ">
              <th className="px-4 py-4  text-primary ">Sr.No</th>
              <th className="px-4 py-4  text-primary  ">Image</th>
              <th className="px-4 py-4  text-primary  ">Title</th>
              <th className="px-4 py-4 text-primary  ">Cuisine</th>
              <th className="px-4 py-4  text-primary  ">Time</th>
              <th className="px-4 py-4  text-primary ">Servings</th>
              <th className="px-4 py-4  text-primary ">Level</th>
              <th className="px-4 py-4  text-primary ">Recommended</th>
              <th className="  px-4 py-4  text-right text-primary">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((recipe: any, index: number) => (
              <tr key={recipe._id}>
                <td className="px-4 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-4">
                  <img
                    src={recipe.thumbnailImage}
                    alt={recipe.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-4 font-medium text-dark">
                  {recipe.title}
                </td>
                <td className="px-4 py-4">{recipe.cuisine}</td>
                <td className="px-4 py-4">{recipe.cookingTime} mins</td>
                <td className="px-4 py-4">{recipe.servings}</td>
                <td className="px-4 py-4">{recipe.level} </td>
                <td className=" mt-4 flex items-center justify-center px-4 py-4">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={recipe.is_favorite}
                      onChange={() =>
                        handleToggleRecommended(recipe._id, index)
                      }
                    />
                    <div className="peer h-5 w-10 rounded-full bg-red-600 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
                  </label>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleView(recipe._id)}
                      className="text-primary hover:text-blue-800"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(recipe._id)}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <RecipeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recipe={selectedRecipe}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteModal
        isLoading={isLoading}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        recipe={selectedRecipe}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default TableFour;
