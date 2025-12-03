import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="rounded bg-[#ebe2c4] px-3 py-1 text-sm hover:bg-[#e4d6a7] disabled:opacity-50"
      >
        Prev
      </button>

      {pageNumbers.map((num, index) =>
        typeof num === "string" ? (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`rounded px-3 py-1 text-sm transition-all duration-150 ${
              num === currentPage
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {num}
          </button>
        ),
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rounded bg-[#ebe2c4] px-3 py-1 text-sm hover:bg-[#e4d6a7] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
