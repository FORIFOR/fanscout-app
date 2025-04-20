import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust start and end to always show 3 middle pages
      if (start === 2) {
        end = Math.min(totalPages - 1, start + 2);
      }
      
      if (end === totalPages - 1) {
        start = Math.max(2, end - 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="mt-6 flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        <Button 
          variant="outline"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <i className="fas fa-chevron-left text-xs"></i>
        </Button>
        
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            );
          }
          
          return (
            <Button 
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={`relative inline-flex items-center px-4 py-2 border ${
                currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          );
        })}
        
        <Button 
          variant="outline"
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <i className="fas fa-chevron-right text-xs"></i>
        </Button>
      </nav>
    </div>
  );
}
