"use client";
import React from "react";
import ReactPaginate from "react-paginate";

/**
 * Common Pagination component using react-paginate
 * @param {number} currentPage - The current active page
 * @param {number} pageCount - Total number of pages
 * @param {Function} onPageChange - Callback function to handle page change
 */
const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  // Labels for previous and next page navigation buttons
  const PrevLabel = () => <span>←</span>;
  const NextLabel = () => <span>→</span>;

  if (pageCount > 1) {
    return (
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={<PrevLabel />}
          nextLabel={<NextLabel />}
          breakLabel={"..."}
          breakClassName="mx-1 text-gray-500"
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={(selectedItem) =>
            onPageChange(selectedItem.selected + 1)
          }
          containerClassName="flex items-center space-x-1"
          pageClassName="px-3 py-1 rounded hover:bg-gray-200"
          activeClassName="bg-blue-500 text-white"
          previousClassName={`px-3 py-1 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
          nextClassName={`px-3 py-1 rounded ${
            currentPage === pageCount
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
          forcePage={currentPage - 1}
          disabledClassName="text-gray-400 cursor-not-allowed"
        />
      </div>
    );
  }
};

export default Pagination;
