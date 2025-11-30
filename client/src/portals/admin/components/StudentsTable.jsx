'use client';

import React, { useId, useMemo, useState } from 'react';
import { SearchIcon, ChevronDown, Download, Pencil, MoreVertical } from 'lucide-react';
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../common/components/ui/table';
import { Badge } from '../../../common/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../common/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '../../../common/components/ui/input';
import { Label } from '../../../common/components/ui/label';
import { toast } from 'sonner';
import TablePagination from '@/common/components/TablePagination';
import { cn } from '@/common/lib/utils';

// Capstone Status Cell Component
const CapstoneStatusCell = ({ student, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(student.capstoneStatus);

  const getStatusBadgeVariant = status => {
    switch (status) {
      case 'Graded':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20';
      case 'Submitted':
        return 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20';
    }
  };

  const handleStatusChange = newStatus => {
    setCurrentStatus(newStatus);
    toast.success(`Capstone status updated to ${newStatus} for ${student.name}`);

    if (onStatusUpdate) {
      onStatusUpdate(student.id, newStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className={`${getStatusBadgeVariant(currentStatus)} font-medium border`}
      >
        {currentStatus}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 w-40">
          <DropdownMenuItem
            onClick={() => handleStatusChange('Graded')}
            className="text-green-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'Graded'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Graded
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange('Submitted')}
            className="text-yellow-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'Submitted'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Submitted
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange('In Progress')}
            className="text-blue-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'In Progress'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              In Progress
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Payment Status Cell Component
const PaymentStatusCell = ({ student, onPaymentStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(student.paymentStatus);

  const getPaymentStatusVariant = status => {
    switch (status) {
      case 'Full Paid':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20';
      case 'Half Paid':
        return 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20';
      case 'Unpaid':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20';
    }
  };

  const handlePaymentStatusChange = newStatus => {
    setCurrentStatus(newStatus);
    toast.success(`Payment status updated to ${newStatus} for ${student.name}`);

    if (onPaymentStatusUpdate) {
      onPaymentStatusUpdate(student.id, newStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className={`${getPaymentStatusVariant(currentStatus)} font-medium border`}
      >
        {currentStatus}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 w-40">
          <DropdownMenuItem
            onClick={() => handlePaymentStatusChange('Full Paid')}
            className="text-green-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'Full Paid'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Full Paid
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusChange('Half Paid')}
            className="text-orange-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'Half Paid'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Half Paid
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePaymentStatusChange('Unpaid')}
            className="text-red-400 hover:bg-zinc-700 cursor-pointer"
            disabled={currentStatus === 'Unpaid'}
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Unpaid
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Filter Component
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

  // Dropdown variant
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

  // Text search variant
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

const defaultPageSize = 10;

const StudentsTable = ({ data = [] }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const handleIssueCertificate = student => {
    setIsDialogOpen(false);

    toast.success('Certificate is being issued', {
      description: `The certificate is being issued to ${student.name}`,
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      duration: 5000,
    });
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    toast.success('CSV export initiated');
  };

  const openCertificateDialog = student => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  // Define columns
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
        cell: ({ row }) => <div className="text-zinc-300">{row.getValue('email')}</div>,
      },
      {
        header: 'College',
        accessorKey: 'college',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-zinc-200">{row.getValue('college')}</div>,
      },
      {
        header: 'Year',
        accessorKey: 'year',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => <div className="text-zinc-200">{row.getValue('year')}</div>,
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => (
          <PaymentStatusCell
            student={row.original}
            onPaymentStatusUpdate={(studentId, newStatus) => {
              console.log(`Update student ${studentId} payment to ${newStatus}`);
            }}
          />
        ),
      },
      {
        header: 'Capstone Status',
        accessorKey: 'capstoneStatus',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => (
          <CapstoneStatusCell
            student={row.original}
            onStatusUpdate={(studentId, newStatus) => {
              console.log(`Update student ${studentId} to ${newStatus}`);
            }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const student = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => openCertificateDialog(student)}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Issue Certificate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

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
  });

  return (
    <div className="w-full">
      {/* Filters and Export Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="w-44">
            <Filter column={table.getColumn('name')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('email')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('college')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('paymentStatus')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('capstoneStatus')} />
          </div>
        </div>

        <Button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden w-full">
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

      {/* Certificate Issue Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              Issue Certificate
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Review the project details before issuing the certificate
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase font-bold">Student Name</span>
                  <p className="font-medium text-base text-zinc-100">{selectedStudent.name}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase font-bold">
                    GitHub Repository
                  </span>
                  <a
                    href={selectedStudent.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm hover:underline break-all"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {selectedStudent.githubLink}
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase font-bold">
                    Live Project Link
                  </span>
                  <a
                    href={selectedStudent.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm hover:underline break-all"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {selectedStudent.liveLink}
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase font-bold">Payment ID</span>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-mono">
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {selectedStudent.paymentId || 'TXN_123456789'}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedStudent.paymentId || 'TXN_123456789');
                        toast.success('Payment ID copied to clipboard');
                      }}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy Payment ID"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-zinc-700 text-zinc-900"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedStudent && handleIssueCertificate(selectedStudent)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Issue Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsTable;

