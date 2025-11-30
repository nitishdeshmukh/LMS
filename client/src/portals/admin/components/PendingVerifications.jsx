'use client';

import React, { useId, useMemo, useState } from 'react';
import { SearchIcon, ChevronDown, X } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Badge } from '../../../common/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../common/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../common/components/ui/dropdown-menu';
import { Button } from '@/common/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { Input } from '../../../common/components/ui/input';
import { toast } from 'sonner';
import { Toaster } from '@/common/components/ui/sonner';
import TablePagination from '@/common/components/TablePagination';
import { cn } from '@/common/lib/utils';

// Filter Component - Corrected version
function Filter({ column }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta || {};
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : '';

  const sortedUniqueValues = useMemo(() => {
    const values = Array.from(column.getFacetedUniqueValues().keys());
    const flattenedValues = values.reduce((acc, curr) => {
      if (Array.isArray(curr)) return [...acc, ...curr];
      return [...acc, curr];
    }, []);
    return Array.from(new Set(flattenedValues)).sort();
  }, [column.getFacetedUniqueValues()]);

  // Dropdown variant - FIXED: Removed e.preventDefault()
  if (filterVariant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 min-w-[160px]"
          >
            <span
              className={cn(
                columnFilterValue ? 'text-zinc-200' : 'text-zinc-400',
                'truncate flex-1 text-left',
              )}
            >
              {columnFilterValue ? String(columnFilterValue) : `Filter by ${columnHeader}`}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-800 border-zinc-700 min-w-[160px]" align="start">
          {sortedUniqueValues.map(value => (
            <DropdownMenuItem
              key={String(value)}
              className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              onSelect={() => {
                column.setFilterValue(value);
              }}
            >
              {String(value)}
            </DropdownMenuItem>
          ))}
          {columnFilterValue && (
            <>
              <div className="h-px bg-zinc-700 my-1" />
              <DropdownMenuItem
                className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                onSelect={() => {
                  column.setFilterValue(undefined);
                }}
              >
                Clear Filter
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Text search variant
  return (
    <div className="relative min-w-[160px]">
      <Input
        id={`${id}-input`}
        className="peer pl-9 bg-zinc-800 text-zinc-200 border-zinc-700 placeholder:text-zinc-400"
        value={columnFilterValue ?? ''}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search ${columnHeader.toLowerCase()}`}
        type="text"
      />
      <div className="text-zinc-400 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  );
}

const defaultPageSize = 5;

const PendingVerifications = () => {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const handleVerifyStudent = studentData => {
    setOpenPopoverId(null);

    toast.success('Sending email to the student', {
      description: `Verification email is being sent to ${studentData.email}`,
      icon: (
        <svg
          className="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      duration: 5000,
    });
  };

  const studentsData = useMemo(
    () => [
      {
        id: 1,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        college: 'IIT Bombay',
        year: 'Third Year',
        domain: 'Data Science',
        paymentStatus: 'Pending',
        paymentId: 'PAY_001',
      },
      {
        id: 2,
        name: 'Diya Patel',
        email: 'diya.patel@example.com',
        college: 'NIT Trichy',
        year: 'Final Year',
        domain: 'Web Development',
        paymentStatus: 'Pending',
        paymentId: 'PAY_002',
      },
      {
        id: 3,
        name: 'Rohan Gupta',
        email: 'rohan.gupta@example.com',
        college: 'BITS Pilani',
        year: 'Second Year',
        domain: 'Machine Learning',
        paymentStatus: 'Pending',
        paymentId: 'PAY_003',
      },
      {
        id: 4,
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        college: 'IIT Delhi',
        year: 'Third Year',
        domain: 'Cybersecurity',
        paymentStatus: 'Pending',
        paymentId: 'PAY_004',
      },
      {
        id: 5,
        name: 'Vikram Kumar',
        email: 'vikram.kumar@example.com',
        college: 'VIT Vellore',
        year: 'Final Year',
        domain: 'Cloud Computing',
        paymentStatus: 'Pending',
        paymentId: 'PAY_005',
      },
    ],
    [],
  );

  // Define columns - wrapped in useMemo to prevent recreation
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => <div className="font-medium text-zinc-100">{row.getValue('name')}</div>,
      },
      {
        header: 'Email',
        accessorKey: 'email',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => <div className="text-blue-400">{row.getValue('email')}</div>,
      },
      {
        header: 'College',
        accessorKey: 'college',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-blue-400">{row.getValue('college')}</div>,
      },
      {
        header: 'Year',
        accessorKey: 'year',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-zinc-200">{row.getValue('year')}</div>,
      },
      {
        header: 'Domain',
        accessorKey: 'domain',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-zinc-200">{row.getValue('domain')}</div>,
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: ({ row }) => (
          <Badge className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20">
            {row.getValue('paymentStatus')}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const student = row.original;

          return (
            <Popover
              open={openPopoverId === student.id}
              onOpenChange={open => setOpenPopoverId(open ? student.id : null)}
            >
              <PopoverTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Verify
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 bg-zinc-900 border-zinc-800 text-white">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg">Confirm Verification</h4>
                    <p className="text-sm text-zinc-400">
                      Do you really want to verify this student?
                    </p>
                  </div>

                  <div className="space-y-2 py-3 border-y border-zinc-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Name:</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Email:</span>
                      <span className="font-medium">{student.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Payment ID:</span>
                      <span className="font-mono text-blue-400">{student.paymentId}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpenPopoverId(null)}
                      className="flex-1 border-zinc-700 bg-red-300 text-zinc-900 hover:bg-red-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleVerifyStudent(student)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        },
      },
    ],
    [openPopoverId],
  );

  const table = useReactTable({
    data: studentsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: { sorting, pagination, columnFilters },
    enableSortingRemoval: false,
  });

  const handleResetFilters = () => {
    table.resetColumnFilters();
  };

  const hasActiveFilters = columnFilters.length > 0;

  return (
    <div className="p-8 min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-sm border border-zinc-700">
          <div className="flex items-center gap-4 flex-nowrap">
            <Filter column={table.getColumn('name')} />
            <Filter column={table.getColumn('email')} />
            <Filter column={table.getColumn('college')} />
            <Filter column={table.getColumn('year')} />
            <Filter column={table.getColumn('domain')} />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:bg-zinc-700"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-800"
                >
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="font-semibold text-zinc-300 select-none">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="transition-colors hover:bg-zinc-800 border-zinc-800"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-400">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={table.getState().pagination.pageSize}
            setPageIndex={table.setPageIndex}
            setPageSize={table.setPageSize}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            previousPage={table.previousPage}
            nextPage={table.nextPage}
            paginationItemsToDisplay={5}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingVerifications;

