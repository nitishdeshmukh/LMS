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
import { toast } from 'sonner';

import CertificateIssueDialog from './CertificateIssueDialog';
import adminService from '@/services/admin/adminService';

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
import { Input } from '../../../common/components/ui/input';
import { Label } from '../../../common/components/ui/label';
import { Button } from '@/common/components/ui/button';
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

const StudentsTable = ({ data , onRefresh }) => {
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isIssuingCert, setIsIssuingCert] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Open Certificate Dialog
  const openCertificateDialog = student => {
    setSelectedStudent(student);
    setIsCertDialogOpen(true);
  };

  // Confirm Issue Certificate
  const handleConfirmIssueCertificate = async (student) => {
    try {
      setIsIssuingCert(true);
      toast.loading('Issuing certificate...', { id: 'cert-issue' });

      // Generate certificate ID using browser crypto API with fallback
      let certificateId;
      try {
        if (crypto && crypto.randomUUID) {
          certificateId = `C2D-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
        } else {
          // Fallback for older browsers
          certificateId = `C2D-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        }
      } catch (error) {
        console.error('Error generating certificate ID:', error);
        // Fallback
        certificateId = `C2D-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      }
      
      console.log('Generated Certificate ID:', certificateId);
      console.log('Issuing certificate with data:', {
        enrollmentId: student.enrollmentId,
        certificateId,
        amountRemaining: 0,
        paymentStatus: 'FULLY_PAID'
      });

      const requestData = {
        enrollmentId: student.enrollmentId,
        certificateId: certificateId,
        amountRemaining: 0,
        paymentStatus: 'FULLY_PAID',
      };

      console.log('Request data before API call:', JSON.stringify(requestData));

      const response = await adminService.issueCertificateByEnrollmentId(requestData);

      if (response.success) {
        toast.success('Certificate issued successfully', { id: 'cert-issue' });
        setIsCertDialogOpen(false);
        if (onRefresh) {
          onRefresh(); // Refresh list
        }
      } else {
        throw new Error(response.message || 'Failed to issue certificate');
      }
    } catch (err) {
      console.error('Error issuing certificate:', err);
      toast.error('Failed to issue certificate', {
        id: 'cert-issue',
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsIssuingCert(false);
    }
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    toast.success('CSV export initiated');
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
      <CertificateIssueDialog
        isOpen={isCertDialogOpen}
        onOpenChange={setIsCertDialogOpen}
        student={selectedStudent}
        onConfirm={handleConfirmIssueCertificate}
        isIssuing={isIssuingCert}
      />
    </div>
  );
};

export default StudentsTable;
