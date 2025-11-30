'use client';

import React, { useId, useMemo, useState } from 'react';
import { SearchIcon, ChevronDown, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
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
import QueryDetails from '@/portals/admin/components/QueryDetails';

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

const defaultPageSize = 5;

const Support = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const queriesData = useMemo(
    () => [
      {
        id: 1,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        college: 'IIT Bombay',
        year: 'Third Year',
        queryTopic: 'Issue with accessing course materials',
        queryText:
          "Hello, I'm unable to access the video lectures for the 'Advanced Web Development' course. When I click on the link, it shows a 404 error page. Could you please look into this? Thank you.",
        coursesInvolved: ['Advanced Web Development', 'Data Structures & Algorithms'],
        status: 'Open',
        priority: 'High',
        category: 'Technical',
        submittedDate: '15 Aug 2024',
        phone: '+91 98765 43210',
        studentId: 'STU2024001',
      },
      {
        id: 2,
        name: 'Diya Patel',
        email: 'diya.patel@example.com',
        college: 'NIT Trichy',
        year: 'Final Year',
        queryTopic: 'Payment verification delay',
        queryText:
          'I made the payment for the Data Science course 3 days ago, but my account still shows payment pending. Transaction ID: TXN123456789. Please help.',
        coursesInvolved: ['Data Science Fundamentals'],
        status: 'In Progress',
        priority: 'Medium',
        category: 'Payment',
        submittedDate: '14 Aug 2024',
        phone: '+91 98765 43211',
        studentId: 'STU2024002',
      },
      {
        id: 3,
        name: 'Rohan Gupta',
        email: 'rohan.gupta@example.com',
        college: 'BITS Pilani',
        year: 'Second Year',
        queryTopic: 'Certificate not generated',
        queryText:
          "I completed the Machine Learning course last week, but I haven't received my certificate yet. When will it be available?",
        coursesInvolved: ['Machine Learning Basics', 'Python Programming'],
        status: 'Open',
        priority: 'Low',
        category: 'Certificate',
        submittedDate: '13 Aug 2024',
        phone: '+91 98765 43212',
        studentId: 'STU2024003',
      },
      {
        id: 4,
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        college: 'IIT Delhi',
        year: 'Third Year',
        queryTopic: 'Assignment submission failed',
        queryText:
          'I tried to submit my assignment for the Cybersecurity module, but it keeps showing an error. The deadline is tomorrow. Please help urgently!',
        coursesInvolved: ['Cybersecurity Essentials'],
        status: 'Open',
        priority: 'High',
        category: 'Technical',
        submittedDate: '16 Aug 2024',
        phone: '+91 98765 43213',
        studentId: 'STU2024004',
      },
      {
        id: 5,
        name: 'Vikram Kumar',
        email: 'vikram.kumar@example.com',
        college: 'VIT Vellore',
        year: 'Final Year',
        queryTopic: 'Course content clarification',
        queryText:
          'I have some doubts regarding the AWS deployment section in the Cloud Computing course. Can I get a mentor session scheduled?',
        coursesInvolved: ['Cloud Computing with AWS', 'DevOps Fundamentals'],
        status: 'Resolved',
        priority: 'Low',
        category: 'General',
        submittedDate: '10 Aug 2024',
        phone: '+91 98765 43214',
        studentId: 'STU2024005',
      },
    ],
    [],
  );

  const handleOpenQuery = query => {
    setSelectedQuery(query);
  };

  const handleBackToSupport = () => {
    setSelectedQuery(null);
  };

  const handleResolveQuery = query => {
    console.log('Resolve query:', query.id);
  };

  const handleCloseQuery = query => {
    console.log('Close query:', query.id);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20';
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20';
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20';
      case 'Medium':
        return 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20';
    }
  };

  // Columns
  const columns = useMemo(
    () => [
      {
        header: 'Student Name',
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
        header: 'Query Topic',
        accessorKey: 'queryTopic',
        meta: { filterVariant: 'text' },
        cell: ({ row }) => (
          <div className="text-zinc-200 max-w-xs truncate">{row.getValue('queryTopic')}</div>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'category',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => <div className="text-zinc-200">{row.getValue('category')}</div>,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => (
          <Badge className={getPriorityColor(row.getValue('priority'))}>
            {row.getValue('priority')}
          </Badge>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        meta: { filterVariant: 'dropdown' },
        cell: ({ row }) => (
          <Badge className={getStatusColor(row.getValue('status'))}>{row.getValue('status')}</Badge>
        ),
      },
      {
        header: 'Submitted Date',
        accessorKey: 'submittedDate',
        cell: ({ row }) => <div className="text-zinc-400">{row.getValue('submittedDate')}</div>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const query = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-500">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onSelect={() => handleOpenQuery(query)}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Open Query
                </DropdownMenuItem>
                {query.status !== 'Resolved' && (
                  <DropdownMenuItem
                    onSelect={() => handleResolveQuery(query)}
                    className="text-green-400 hover:bg-zinc-700 cursor-pointer"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={() => handleCloseQuery(query)}
                  className="text-red-400 hover:bg-zinc-700 cursor-pointer"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Close Query
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
    data: queriesData,
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

  // If a query is selected, show QueryDetails component
  if (selectedQuery) {
    return <QueryDetails query={selectedQuery} onBack={handleBackToSupport} />;
  }

  // Otherwise, show the support queries table
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="w-44">
            <Filter column={table.getColumn('name')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('email')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('queryTopic')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('category')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('priority')} />
          </div>
          <div className="w-44">
            <Filter column={table.getColumn('status')} />
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
                    No queries found
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

export default Support;

