import React, { useState } from 'react';
import { Badge } from '../../../common/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../common/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../common/components/ui/dropdown-menu';
import { ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import QueryDetails from '@/portals/admin/components/QueryDetails';

const Support = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    category: 'All',
  });

  const queriesData = [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      college: 'IIT Bombay',
      year: 'Third Year',
      queryTopic: 'Issue with accessing course materials',
      queryText: "Hello, I'm unable to access the video lectures for the 'Advanced Web Development' course. When I click on the link, it shows a 404 error page. Could you please look into this? Thank you.",
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
      queryText: "I made the payment for the Data Science course 3 days ago, but my account still shows payment pending. Transaction ID: TXN123456789. Please help.",
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
      queryText: "I completed the Machine Learning course last week, but I haven't received my certificate yet. When will it be available?",
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
      queryText: "I tried to submit my assignment for the Cybersecurity module, but it keeps showing an error. The deadline is tomorrow. Please help urgently!",
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
      queryText: "I have some doubts regarding the AWS deployment section in the Cloud Computing course. Can I get a mentor session scheduled?",
      coursesInvolved: ['Cloud Computing with AWS', 'DevOps Fundamentals'],
      status: 'Resolved',
      priority: 'Low',
      category: 'General',
      submittedDate: '10 Aug 2024',
      phone: '+91 98765 43214',
      studentId: 'STU2024005',
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(queriesData.length / itemsPerPage);

  const handleResetFilters = () => {
    setFilters({
      status: 'All',
      priority: 'All',
      category: 'All',
    });
  };

  const handleOpenQuery = query => {
    setSelectedQuery(query);
  };

  const handleBackToSupport = () => {
    setSelectedQuery(null);
  };

  const paginatedData = queriesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPaginationButtons = () => {
    const buttons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        buttons.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return buttons;
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

  // If a query is selected, show QueryDetails component
  if (selectedQuery) {
    return <QueryDetails query={selectedQuery} onBack={handleBackToSupport} />;
  }

  // Otherwise, show the support queries table
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-sm border border-zinc-700">
          <div className="flex items-center gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                  Filter by Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'All' })} className="text-zinc-200 hover:bg-zinc-700">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'Open' })} className="text-zinc-200 hover:bg-zinc-700">
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'In Progress' })} className="text-zinc-200 hover:bg-zinc-700">
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, status: 'Resolved' })} className="text-zinc-200 hover:bg-zinc-700">
                  Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                  Filter by Priority
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, priority: 'All' })} className="text-zinc-200 hover:bg-zinc-700">
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, priority: 'High' })} className="text-zinc-200 hover:bg-zinc-700">
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, priority: 'Medium' })} className="text-zinc-200 hover:bg-zinc-700">
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, priority: 'Low' })} className="text-zinc-200 hover:bg-zinc-700">
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                  Filter by Category
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, category: 'All' })} className="text-zinc-200 hover:bg-zinc-700">
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, category: 'Technical' })} className="text-zinc-200 hover:bg-zinc-700">
                  Technical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, category: 'Payment' })} className="text-zinc-200 hover:bg-zinc-700">
                  Payment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, category: 'Certificate' })} className="text-zinc-200 hover:bg-zinc-700">
                  Certificate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, category: 'General' })} className="text-zinc-200 hover:bg-zinc-700">
                  General
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:bg-zinc-700"
            >
              Reset Filters
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-800 border-zinc-700 hover:bg-zinc-800">
                <TableHead className="font-semibold text-zinc-300">Student Name</TableHead>
                <TableHead className="font-semibold text-zinc-300">Email</TableHead>
                <TableHead className="font-semibold text-zinc-300">Query Topic</TableHead>
                <TableHead className="font-semibold text-zinc-300">Category</TableHead>
                <TableHead className="font-semibold text-zinc-300">Priority</TableHead>
                <TableHead className="font-semibold text-zinc-300">Status</TableHead>
                <TableHead className="font-semibold text-zinc-300">Submitted Date</TableHead>
                <TableHead className="font-semibold text-zinc-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(query => (
                <TableRow key={query.id} className="hover:bg-zinc-800 border-zinc-800">
                  <TableCell className="font-medium text-zinc-100">{query.name}</TableCell>
                  <TableCell className="text-blue-400">{query.email}</TableCell>
                  <TableCell className="text-zinc-200 max-w-xs truncate">{query.queryTopic}</TableCell>
                  <TableCell className="text-zinc-200">{query.category}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(query.priority)}>{query.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{query.submittedDate}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleOpenQuery(query)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Open Query
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-zinc-300 hover:bg-zinc-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-zinc-400 px-2">Previous</span>

              {renderPaginationButtons().map((page, index) =>
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-zinc-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}

              <span className="text-sm text-zinc-400 px-2">Next</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-zinc-300 hover:bg-zinc-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
