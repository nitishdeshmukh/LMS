'use client';

import React, { useId, useMemo, useState, useEffect } from 'react';
import { SearchIcon, ChevronDown, MoreVertical, Loader2, RefreshCw } from 'lucide-react';
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
import { toast } from 'sonner';

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
import { Input } from '../../../common/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import TablePagination from '@/common/components/TablePagination';
import { cn } from '@/common/lib/utils';
import adminService from '@/services/admin/adminService';

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 min-w-40"
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
        <DropdownMenuContent className="bg-zinc-800 border-zinc-700 min-w-40" align="start">
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
    <div className="relative min-w-40">
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

const defaultPageSize = 10;

const PendingVerifications = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // API State
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getOngoingStudents();

      if (response.success) {
        // Transform API data to match table structure
        const transformedData = response.data.pendingUsers.map(student => ({
          id: student._id || student.id,
          name: `${student.name || ''} ${student.middleName || ''} ${student.lastName || ''}`.trim(),
          email: student.email,
          college: student.collegeName,
          year: student.yearOfStudy,
          domain: student.courseName,
          paymentStatus: student.accountStatus === 'pending' ? 'Pending' : student.accountStatus,
          paymentId:
            student.partialPaymentDetails?.transactionId ||
            student.fullPaymentDetails?.transactionId ||
            'N/A',
          enrollmentId: student.enrollmentId,
          userId: student._id || student.id,
        }));
        setStudentsData(transformedData);
      } else {
        throw new Error(response.message || 'Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students');
      toast.error('Failed to load students', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleVerifyStudent = async studentData => {
    try {
      setIsVerifying(true);

      const response = await adminService.approveOngoingStudent(studentData.userId);

      if (response.success) {
        setIsDialogOpen(false);

        toast.success('Student verified successfully', {
          description: `${studentData.name} has been verified and will receive a confirmation email.`,
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          duration: 5000,
        });

        // Refresh the students list
        fetchStudents();
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Error verifying student:', err);
      toast.error('Verification failed', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const openVerifyDialog = student => {
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
        cell: ({ row }) => <div className="text-blue-400">{row.getValue('email')}</div>,
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
        cell: ({ row }) => {
          const status = row.getValue('paymentStatus');
          const statusColors = {
            Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            verified: 'bg-green-500/10 text-green-400 border-green-500/20',
          };

          return (
            <Badge
              className={cn(
                'hover:bg-opacity-20 border',
                statusColors[status] || statusColors.Pending,
              )}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const student = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => openVerifyDialog(student)}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  disabled={
                    student.paymentStatus !== 'Pending' && student.paymentStatus !== 'pending'
                  }
                >
                  <svg
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verify Student
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Pending Verifications</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Review and verify student payment submissions
            </p>
          </div>
          <Button
            onClick={fetchStudents}
            disabled={isLoading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              onClick={fetchStudents}
              variant="outline"
              className="mt-2 text-red-400 border-red-500/20 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-sm border border-zinc-700">
          <div className="flex items-center gap-4 flex-wrap">
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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-zinc-400">Loading students...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow
                      key={headerGroup.id}
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-800"
                    >
                      {headerGroup.headers.map(header => (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-zinc-300 select-none"
                        >
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
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-zinc-400"
                      >
                        No pending verifications found.
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
            </>
          )}
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Confirm Verification
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Do you really want to verify this student? They will receive a confirmation email.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-3 py-4 border-y border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Name:</span>
                <span className="font-medium text-zinc-100">{selectedStudent.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Email:</span>
                <span className="font-medium text-zinc-100">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">College:</span>
                <span className="font-medium text-zinc-100">{selectedStudent.college}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Domain:</span>
                <span className="font-medium text-zinc-100">{selectedStudent.domain}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Payment ID:</span>
                <span className="font-mono text-blue-400">{selectedStudent.paymentId}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isVerifying}
              className="border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:text-red-400 hover:border-red-500/20"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedStudent && handleVerifyStudent(selectedStudent)}
              disabled={isVerifying}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Send Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingVerifications;

