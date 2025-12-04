'use client';

import React, { useId, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MoreVertical, Check, ChevronDown, Loader2 } from 'lucide-react';
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

import { Input } from '../../../common/components/ui/input';
import { Label } from '../../../common/components/ui/label';
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
import { Button } from '../../../common/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../../common/components/ui/popover';
import { Calendar } from '../../../common/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

import TablePagination from '@/common/components/TablePagination';
import RevokeAccess from './RevokeAccess.jsx';
import PasswordModal from './PasswordModal';
import { cn } from '@/common/lib/utils';
import adminService from '@/services/admin/adminService.js';

/**
 * Formats a date object into a readable string format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string or empty string if invalid
 */
function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Validates if a date object is valid
 * @param {Date} date - The date to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidDate(date) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

/**
 * Normalizes a date string to a comparable format
 * @param {string} dateStr - The date string to normalize
 * @returns {string} Normalized date string
 */
function normalizeDateString(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const columns = [
  {
    header: 'Student Name',
    accessorKey: 'studentName',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => (
      <div className="font-medium text-zinc-100">{row.getValue('studentName')}</div>
    ),
  },
  {
    header: 'Course',
    accessorKey: 'course',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => <div className="text-zinc-200">{row.getValue('course')}</div>,
  },
  {
    header: 'College',
    accessorKey: 'college',
    meta: { filterVariant: 'dropdown' },
    cell: ({ row }) => <div className="text-zinc-200">{row.getValue('college')}</div>,
  },
  {
    header: 'Date',
    accessorKey: 'date',
    meta: { filterVariant: 'date' },
    cell: ({ row }) => <div className="text-zinc-200">{row.getValue('date')}</div>,
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const rowDate = normalizeDateString(row.getValue(columnId));
      const filterDate = filterValue;
      return rowDate === filterDate;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-500">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
            <DropdownMenuItem
              onClick={() => table.options.meta?.handleRevoke(student)}
              className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
            >
              Revoke
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => table.options.meta?.handleViewDetails(student)}
              className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Filter component for table columns
 * @param {Object} props - Component props
 * @param {Object} props.column - TanStack Table column object
 */
function Filter({ column }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta || {};
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : '';

  // State for date picker
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [displayMonth, setDisplayMonth] = useState(undefined);
  const [dateValue, setDateValue] = useState('');

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'date') return [];
    const values = Array.from(column.getFacetedUniqueValues().keys());
    const flattenedValues = values.reduce((acc, curr) => {
      if (Array.isArray(curr)) return [...acc, ...curr];
      return [...acc, curr];
    }, []);
    return Array.from(new Set(flattenedValues)).sort();
  }, [column.getFacetedUniqueValues(), filterVariant]);

  // Date picker variant
  if (filterVariant === 'date') {
    return (
      <div className="*:not-first:mt-2">
        <Label className="text-zinc-300">{columnHeader}</Label>
        <div className="relative flex gap-2">
          <Input
            id={`${id}-date`}
            value={dateValue}
            placeholder="Select Date"
            className="bg-zinc-800 border-zinc-700 text-zinc-200 pr-10 min-w-[180px] placeholder:text-zinc-400"
            onChange={e => {
              const date = new Date(e.target.value);
              setDateValue(e.target.value);
              if (isValidDate(date)) {
                setSelectedDate(date);
                setDisplayMonth(date);
                const formattedDate = formatDate(date);
                column.setFilterValue(formattedDate);
              } else if (e.target.value === '') {
                setSelectedDate(undefined);
                column.setFilterValue(undefined);
              }
            }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
              }
              if (e.key === 'Escape') {
                setDateValue('');
                setSelectedDate(undefined);
                column.setFilterValue(undefined);
              }
            }}
          />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
              >
                <CalendarIcon className="size-3.5 text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 border-zinc-800"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                onSelect={date => {
                  setSelectedDate(date);
                  const formattedDate = formatDate(date);
                  setDateValue(formattedDate);
                  setIsOpen(false);
                  column.setFilterValue(formattedDate);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  // Dropdown variant with Clear Filter option
  if (filterVariant === 'dropdown') {
    return (
      <div className="*:not-first:mt-2">
        <Label className="text-zinc-300">{columnHeader}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100"
            >
              <span
                className={cn(columnFilterValue ? 'text-zinc-200' : 'text-zinc-400', 'truncate')}
              >
                {columnFilterValue ? String(columnFilterValue) : `Filter by ${columnHeader}`}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-44 bg-zinc-800 border-zinc-700 max-h-[300px] overflow-y-auto"
          >
            {sortedUniqueValues.map(value => (
              <DropdownMenuItem
                key={String(value)}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                onClick={() => column.setFilterValue(value)}
              >
                {String(value)}
              </DropdownMenuItem>
            ))}
            {columnFilterValue && (
              <>
                <div className="h-px bg-zinc-700 my-1" />
                <DropdownMenuItem
                  className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => column.setFilterValue(undefined)}
                >
                  Clear Filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={`${id}-input`} className="text-zinc-300">
        {columnHeader}
      </Label>
      <div className="relative">
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
    </div>
  );
}

const defaultPageSize = 5;

/**
 * EnrollmentsTable - Displays student enrollments with filtering and actions
 */
const EnrollmentsTable = () => {
  const navigate = useNavigate();

  // Data fetching states
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table states
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // State for modals - using controlled AlertDialog pattern
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminService.getAllStudents();

        // Transform API response to match your table structure
        const transformedData =
          response.data?.students.map(student => ({
            id: student._id,
            studentName: student.fullName,
            course: student.courseName,
            college: student.collegeName,
            date: new Date(student.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            email: student.email,
          })) || [];

        setData(transformedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch students');
        console.error('Error fetching students:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handler functions
  const handleRevoke = student => {
    //logic to revoke student access
    setSelectedStudent(student);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async password => {
    try {
      await adminService.verifyAdmin(password);
      setIsPasswordModalOpen(false);
      setIsRevokeModalOpen(true);
    } catch (error) {
      console.error('Error verifying admin:', error);
      return;
    }
  };

  const handleViewDetails = student => {
    // Navigate to dynamic route with student data in state
    navigate(`/admin/student/${student.id}`, {
      state: { student },
    });
  };

  const table = useReactTable({
    data,
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
    meta: {
      handleRevoke,
      handleViewDetails,
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-zinc-400 text-sm">Loading students...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-zinc-900 rounded-xl border border-zinc-800">
        <p className="text-red-400 mb-2 font-semibold">Error loading students</p>
        <p className="text-zinc-400 text-sm">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden w-full space-y-4">
        <div className="w-full h-11 p-3">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">All Student Enrollments</h2>
            <p className="text-sm text-zinc-400">
              Displays a comprehensive list of all students, including both active and inactive
              enrollments.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-2 py-6">
          <div className="w-44">
            <Filter column={table.getColumn('studentName')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('course')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('college')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('date')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('email')} />
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-zinc-800 border-zinc-700">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-zinc-300 border-zinc-700 select-none">
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
                  className="transition-colors hover:bg-zinc-800 data-[state=selected]:bg-zinc-700"
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-zinc-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-300">
                  No results.
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

      {/* Password Modal - Using Radix AlertDialog */}
      <PasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onSubmit={handlePasswordSubmit}
      />

      {/* Revoke Modal */}
      <RevokeAccess
        open={isRevokeModalOpen}
        onOpenChange={setIsRevokeModalOpen}
        student={selectedStudent}
        studentName={selectedStudent?.studentName}
      />
    </>
  );
};

export default EnrollmentsTable;

