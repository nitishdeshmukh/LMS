'use client';

import React, { useId, useMemo, useState } from 'react';
import { SearchIcon, Eye, Award, RotateCw, ChevronDown, MoreVertical } from 'lucide-react';
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
import { Input } from '../../../common/components/ui/input';
import { Label } from '../../../common/components/ui/label';
import TablePagination from '@/common/components/TablePagination';
import { cn } from '@/common/lib/utils';

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
                onSelect={() => column.setFilterValue(value)}
              >
                {String(value)}
              </DropdownMenuItem>
            ))}
            {columnFilterValue && (
              <>
                <div className="h-px bg-zinc-700 my-1" />
                <DropdownMenuItem
                  className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                  onSelect={() => column.setFilterValue(undefined)}
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

const CertificateManagement = () => {
  // Combined all students data
  const allStudents = useMemo(
    () => [
      {
        id: 1,
        name: 'Eleanor Pena',
        course: 'Advanced Python Programming',
        avatar: 'https://i.pravatar.cc/150?img=1',
        date: '15 Aug 2024',
        certificateStatus: 'Ready to Issue',
      },
      {
        id: 2,
        name: 'Jane Cooper',
        course: 'UI/UX Design Fundamentals',
        avatar: 'https://i.pravatar.cc/150?img=5',
        date: '10 Aug 2024',
        certificateStatus: 'Ready to Issue',
      },
      {
        id: 3,
        name: 'Cameron Williamson',
        course: 'Data Science with R',
        avatar: 'https://i.pravatar.cc/150?img=8',
        date: '12 Aug 2024',
        certificateStatus: 'Issued',
      },
      {
        id: 4,
        name: 'Cody Fisher',
        course: 'Machine Learning Basics',
        avatar: 'https://i.pravatar.cc/150?img=12',
        date: '05 Aug 2024',
        certificateStatus: 'Issued',
      },
      {
        id: 5,
        name: 'Randy Orton',
        course: 'Machine Learning Basics',
        avatar: 'https://i.pravatar.cc/150?img=12',
        date: '05 Aug 2024',
        certificateStatus: 'Issued',
      },
    ],
    [],
  );

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const handlePreview = student => {
    console.log('Preview certificate for:', student.name);
  };

  const handleIssueCertificate = student => {
    console.log('Issue certificate for:', student.name);
  };

  const handleReissue = student => {
    console.log('Re-issue certificate for:', student.name);
  };

  // Columns
  const columns = useMemo(
    () => [
      {
        header: 'Student',
        accessorKey: 'name',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatar}
              alt={row.getValue('name')}
              className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700"
            />
            <span className="font-medium text-zinc-100">{row.getValue('name')}</span>
          </div>
        ),
      },
      {
        header: 'Course',
        accessorKey: 'course',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-zinc-300">{row.getValue('course')}</div>,
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ row }) => <div className="text-zinc-300">{row.getValue('date')}</div>,
      },
      {
        header: 'Certificate Status',
        accessorKey: 'certificateStatus',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => {
          const status = row.getValue('certificateStatus');
          return (
            <Badge
              className={
                status === 'Issued'
                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const student = row.original;
          const status = student.certificateStatus;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-500">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onSelect={() => handlePreview(student)}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                {status === 'Ready to Issue' ? (
                  <DropdownMenuItem
                    onSelect={() => handleIssueCertificate(student)}
                    className="text-blue-400 hover:bg-zinc-700 cursor-pointer"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Issue Certificate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onSelect={() => handleReissue(student)}
                    className="text-green-400 hover:bg-zinc-700 cursor-pointer"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Re-issue
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: allStudents,
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
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="w-44">
            <Filter column={table.getColumn('name')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('course')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('certificateStatus')} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden">
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
                    No students found
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
       <div className=" overflow-auto">
          <CustomCertificate
            studentName={"Deepak Agrawal"}
            course={"Web Development"}
            timeperiod={"3 Months"}
            conductedFrom={"1-october to 3 october"}
          />
        </div>
      
    </div>
  );
};

export default CertificateManagement;
