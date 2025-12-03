// "use client";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../Pagination/pagination";
import DeleteModal from "../modals/deleteCategory";
import useReviewStore from "@/store/reviewStore";
import { Trash2 } from "lucide-react";
import { OverlayLoaderContext } from "@/contexts/OverlayLoaderContext";

const itemsPerPage = 5;

const TableFour = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { setLoading } = useContext(OverlayLoaderContext);

  const {
    getFeedback,
    deleteFeedback,
    feedbackList = [],
    isLoading,
  } = useReviewStore();

  useEffect(() => {
    (async () => {
      try {
        await getFeedback();
      } catch (error) {
        toast.error("Failed to fetch feedback");
      }
    })();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset to first page when searching
  }, [searchTerm]);

  const handleDelete = (item: any) => {
    setSelectedFeedback(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteFeedback(selectedFeedback._id);
      toast.success("Feedback deleted successfully");
      await getFeedback();
    } catch (error) {
      toast.error("Failed to delete feedback");
    } finally {
      setModalOpen(false);
      setSelectedFeedback(null);
    }
  };

  const filteredData = feedbackList.filter((item) => {
    const title = item.recipeId?.title || item.title || "";
    const email = item.userId?.email || item.userEmail || item.Feedbacker || "";
    const feedback = item.feedback || item.comment || "";
    const term = searchTerm.toLowerCase();

    return (
      title.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      feedback.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1">
      <div className="mb-4 flex items-center gap-4">
        <h3 className="text-xl font-bold text-primary dark:text-white">
            Filter By Email or Title:
          </h3>
        <input
          type="text"
          placeholder="Search by title or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left text-primary">
              <th className="px-4 py-4 font-bold text-primary">Sr.No</th>
              <th className="px-4 py-4 font-bold text-primary">Title</th>
              <th className="px-4 py-4 font-bold text-primary">Feedbacker</th>
              <th className="px-4 py-4 font-bold text-primary">Feedback</th>
              <th className="px-4 py-4 font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item: any, index: number) => (
                <tr
                  key={item._id || index}
                  className="border-b border-gray-200"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    {item.recipeId?.title || item.title || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {item.userId?.email ||
                      item.userEmail ||
                      item.Feedbacker ||
                      "N/A"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3">
                    {item.feedback || item.comment || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item)}
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
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <DeleteModal
          isOpen={modalOpen}
          isLoading={isLoading}
          item={selectedFeedback}
          onClose={handleCloseModal}
          onDelete={confirmDelete}
        />
      </div>
    </div>
  );
};

export default TableFour;
