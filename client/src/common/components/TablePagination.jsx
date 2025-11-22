import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { usePagination } from '@/common/hooks/usePagination'; 
import { cn } from '../lib/utils';

const pageSizes = [5, 10, 25, 50];

const Ellipsis = () => (
  <span className="mx-2 select-none text-zinc-300 font-bold">...</span>
);

function TablePagination({
  className = "",
  pageIndex,
  pageCount,
  pageSize,
  setPageIndex,
  setPageSize,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  paginationItemsToDisplay = 5
}) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: pageIndex + 1,
    totalPages: pageCount,
    paginationItemsToDisplay
  });

  return (
    <div className={cn("flex items-center justify-between gap-3 max-sm:flex-col py-2 px-4 bg-", className)}>
      {/* Page info */}
      <span className="text-zinc-300 text-sm whitespace-nowrap">
        Page <span className="text-white font-semibold">{pageIndex + 1}</span> of{' '}
        <span className="text-white font-semibold">{pageCount}</span>
      </span>
      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="disabled:pointer-events-none disabled:opacity-50 bg-black border-zinc-700 text-white"
          onClick={previousPage}
          disabled={!canPreviousPage}
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        {showLeftEllipsis && <Ellipsis />}
        {pages.map((page) => {
          const isActive = page === pageIndex + 1;
          return (
            <Button
              key={page}
              size="icon"
              variant={isActive ? 'outline' : 'ghost'}
              onClick={() => setPageIndex(page - 1)}
              aria-current={isActive ? "page" : undefined}
              className={
                cn(
                  "border-zinc-700 hover:bg-zinc-800 text-white",
                  isActive ? "border-white bg-zinc-900 font-bold" : "bg-black"
                )
              }
            >
              {page}
            </Button>
          );
        })}
        {showRightEllipsis && <Ellipsis />}
        <Button
          size="icon"
          variant="outline"
          className="disabled:pointer-events-none disabled:opacity-50 bg-black border-zinc-700 text-white"
          onClick={nextPage}
          disabled={!canNextPage}
          aria-label="Go to next page"
        >
          <ChevronRightIcon aria-hidden="true" />
        </Button>
      </div>
      {/* Page size selector */}
      <div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger
            id="results-per-page"
            className="w-fit whitespace-nowrap border-zinc-700 bg-black text-zinc-100"
          >
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="bg-black">
            {pageSizes.map((ps) => (
              <SelectItem
                key={ps}
                value={ps.toString()}
                className="bg-black text-white"
              >
                {ps} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default TablePagination;
