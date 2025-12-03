/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { toast } from "react-toastify";
import DeleteModal from "../modals/deleteCategory";
import CategoryModal from "../modals/category";
import Pagination from "../Pagination/pagination";
import useCategoryStore from "@/store/categoryStore";
import { useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}
const CategoryTable = () => {
  const { categoryList, fetchCategory, deleteCategory, isLoading } =
    useCategoryStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categoryList.length / itemsPerPage);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const paginatedCategories = categoryList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchCategories = async () => {
    try {
      await fetchCategory();
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (cat: any) => {
    setSelectedCategory(cat);
    setDeleteModalOpen(true);
  };
  const confirmDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="rounded-md border border-stroke bg-white p-6 shadow-sm">
      {/* <h2 className="mb-4 text-xl font-semibold">Category List</h2> */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto ">
          <thead>
            <tr className="bg-[#F7F9FC] text-left text-primary">
              <th className="px-4 py-4  text-primary ">Sr.No</th>
              <th className="px-4 py-4  text-primary ">Image</th>
              <th className="px-4 py-4  text-primary ">Category Name</th>
              <th className="px-4 py-4 text-right  text-primary ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat: Category, index: number) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {cat.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="mr-3 text-primary"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    className="text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {categoryList.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <DeleteModal
        isLoading={isLoading}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        item={selectedCategory}
        onDelete={confirmDelete}
      />

      <CategoryModal
        isOpen={editModalOpen}
        mode="edit"
        onClose={() => setEditModalOpen(false)}
        item={selectedCategory}
        onSave={(updatedItem) => {}}
      />
    </div>
  );
};

export default CategoryTable;
