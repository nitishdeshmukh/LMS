'use client';

import React, { useId, useMemo, useState } from 'react';
import { SearchIcon, MoreVertical } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../common/components/ui/select';
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

import TablePagination from '@/common/components/TablePagination';
// Line 57 - Change from RevokeSuccess to RevokeAccess
import RevokeAccess from "./RevokeAccess.jsx";
import StudentDetail from './StudentDetail.jsx';

// Line 58 - StudentDetail.jsx exists, so this should work

import PasswordModal from './PasswordModal';

import { Toaster } from '@/common/components/ui/sonner';


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
    meta: { filterVariant: 'select' },
    cell: ({ row }) => <div className="text-zinc-200">{row.getValue('college')}</div>,
  },
  {
    header: 'Date',
    accessorKey: 'date',
    meta: { filterVariant: 'range' },
    cell: ({ row }) => <div className="text-zinc-200">{row.getValue('date')}</div>,
    enableSorting: false,
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
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-500"
            >
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

const enrollments = [
  {
    studentName: 'Alex Johnson',
    course: 'Advanced JavaScript',
    college: 'College of Engineering',
    date: '2023-10-26',
    email: 'alex.johnson@example.com',
  },
  {
    studentName: 'Maria Garcia',
    course: 'UI/UX Design Fundamentals',
    college: 'College of Arts & Design',
    date: '2023-10-26',
    email: 'maria.garcia@example.com',
  },
  {
    studentName: 'James Smith',
    course: 'Data Structures & Algorithms',
    college: 'College of Science',
    date: '2023-10-25',
    email: 'james.smith@example.com',
  },
  {
    studentName: 'Patricia Brown',
    course: 'Introduction to Python',
    college: 'College of Engineering',
    date: '2023-10-25',
    email: 'patricia.brown@example.com',
  },
];

function Filter({ column }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta || {};
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : '';

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return [];
    const values = Array.from(column.getFacetedUniqueValues().keys());
    const flattenedValues = values.reduce((acc, curr) => {
      if (Array.isArray(curr)) return [...acc, ...curr];
      return [...acc, curr];
    }, []);
    return Array.from(new Set(flattenedValues)).sort();
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === 'range') {
    return (
      <div className="*:not-first:mt-2">
        <Label className="text-zinc-300">{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-r-none bg-zinc-800 text-zinc-200 border-zinc-700"
            value={columnFilterValue?.[0] ?? ''}
            onChange={e =>
              column.setFilterValue(old => [e.target.value ? e.target.value : undefined, old?.[1]])
            }
            placeholder="Min"
            type="text"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-l-none bg-zinc-800 text-zinc-200 border-zinc-700"
            value={columnFilterValue?.[1] ?? ''}
            onChange={e =>
              column.setFilterValue(old => [old?.[0], e.target.value ? e.target.value : undefined])
            }
            placeholder="Max"
            type="text"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === 'select') {
    return (
      <div className="*:not-first:mt-2">
        <Label htmlFor={`${id}-select`} className="text-zinc-300">
          {columnHeader}
        </Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={value => {
            column.setFilterValue(value === 'all' ? undefined : value);
          }}
        >
          <SelectTrigger
            id={`${id}-select`}
            className="w-full bg-zinc-800 text-zinc-200 border-zinc-700"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map(value => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          className="peer pl-9 bg-zinc-800 text-zinc-200 border-zinc-700"
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

const EnrollmentsTable = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // State for modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Handler functions
  const handleRevoke = (student) => {
    setSelectedStudent(student);
    setShowPasswordModal(true); // Show password modal first
  };

  const handlePasswordSubmit = (password) => {
    // Verify password here (replace with your actual password verification logic)
    const correctPassword = "admin123"; // This should come from your backend

    if (password === correctPassword) {
      setShowPasswordModal(false);
      setShowRevokeModal(true); // Open revoke modal after correct password
    } else {
      alert("Incorrect password!"); // Or show error message
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const table = useReactTable({
    data: enrollments,
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

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden w-full space-y-4">
        <Toaster position="top-center" />
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
          <div className="w-36">
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

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {/* Revoke Modal - Only shows after password verification */}
      {showRevokeModal && (
        <RevokeAccess
          student={selectedStudent}
          studentName={selectedStudent?.studentName}
          onClose={() => setShowRevokeModal(false)}
        />
      )}


      {showDetailsModal && (
        <StudentDetail
          student={selectedStudent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default EnrollmentsTable;
