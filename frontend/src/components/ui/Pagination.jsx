// components/ui/Pagination.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function Pagination({
  items = [],
  itemsPerPage = 5,
  onPageChange,
  className = "",
  showFirstLast = true,
  siblingCount = 1,
  renderItems,
  emptyStateComponent,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, items.length);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page, paginatedData);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      pages.push(...leftRange, "...", totalPages);
    } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      pages.push(1, "...", ...rightRange);
    } else if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      pages.push(1, "...", ...middleRange, "...", totalPages);
    }

    return pages;
  };

  // If no items, render empty state
  if (items.length === 0) {
    if (emptyStateComponent) {
      return emptyStateComponent;
    }
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">No items to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Render items using render prop */}
      {renderItems && renderItems(paginatedData)}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          {/* Items info */}
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Showing <span className="font-semibold">{startItem}</span> to{" "}
            <span className="font-semibold">{endItem}</span> of{" "}
            <span className="font-semibold">{items.length}</span> items
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center space-x-1 order-1 sm:order-2">
            {/* First page button */}
            {showFirstLast && totalPages > 1 && (
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
            )}

            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-transparent flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1 mx-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`
                    min-w-8 px-2.5 py-1.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      page === currentPage
                        ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:from-blue-700 hover:to-blue-800"
                        : page === "..."
                          ? "cursor-default text-gray-500"
                          : "border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                    }
                    ${typeof page === "number" && page !== currentPage ? "hover:shadow-sm" : ""}
                    disabled:opacity-50
                  `}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-transparent flex items-center"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </button>

            {/* Last page button */}
            {showFirstLast && totalPages > 1 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagination;
