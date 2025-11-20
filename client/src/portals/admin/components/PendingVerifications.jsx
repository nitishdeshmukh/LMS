import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PendingVerifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    college: 'All',
    year: 'All',
    domain: 'All',
  });

  const studentsData = [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      college: 'IIT Bombay',
      year: 'Third Year',
      domain: 'Data Science',
      paymentStatus: 'Pending',
    },
    {
      id: 2,
      name: 'Diya Patel',
      email: 'diya.patel@example.com',
      college: 'NIT Trichy',
      year: 'Final Year',
      domain: 'Web Development',
      paymentStatus: 'Pending',
    },
    {
      id: 3,
      name: 'Rohan Gupta',
      email: 'rohan.gupta@example.com',
      college: 'BITS Pilani',
      year: 'Second Year',
      domain: 'Machine Learning',
      paymentStatus: 'Pending',
    },
    {
      id: 4,
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      college: 'IIT Delhi',
      year: 'Third Year',
      domain: 'Cybersecurity',
      paymentStatus: 'Pending',
    },
    {
      id: 5,
      name: 'Vikram Kumar',
      email: 'vikram.kumar@example.com',
      college: 'VIT Vellore',
      year: 'Final Year',
      domain: 'Cloud Computing',
      paymentStatus: 'Pending',
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(studentsData.length / itemsPerPage);

  const handleResetFilters = () => {
    setFilters({
      college: 'All',
      year: 'All',
      domain: 'All',
    });
  };

  const handleVerify = studentName => {
    console.log('Verifying:', studentName);
    // Add your verification logic here
  };

  const paginatedData = studentsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Verifications</h1>
          <p className="text-gray-600">
            View and verify students who have registered but not yet paid.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex text-black items-center gap-2">
                  Filter by College
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-black bg-white">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, college: 'All' })}>
                  All Colleges
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, college: 'IIT Bombay' })}>
                  IIT Bombay
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, college: 'NIT Trichy' })}>
                  NIT Trichy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, college: 'BITS Pilani' })}
                >
                  BITS Pilani
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex text-black items-center gap-2">
                  Filter by Year
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-black bg-white">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, year: 'All' })}>
                  All Years
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, year: 'Second Year' })}>
                  Second Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, year: 'Third Year' })}>
                  Third Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilters({ ...filters, year: 'Final Year' })}>
                  Final Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex text-black items-center gap-2">
                  Filter by Domain
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-black bg-white">
                <DropdownMenuItem onClick={() => setFilters({ ...filters, domain: 'All' })}>
                  All Domains
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Data Science' })}
                >
                  Data Science
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Web Development' })}
                >
                  Web Development
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Machine Learning' })}
                >
                  Machine Learning
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              Reset Filters
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table - Using shadcn Table components */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">College</TableHead>
                <TableHead className="font-semibold text-gray-700">Year</TableHead>
                <TableHead className="font-semibold text-gray-700">Domain</TableHead>
                <TableHead className="font-semibold text-gray-700">Payment Status</TableHead>
                <TableHead className="font-semibold text-gray-700"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(student => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{student.name}</TableCell>
                  <TableCell className="text-blue-600">{student.email}</TableCell>
                  <TableCell className="text-blue-600">{student.college}</TableCell>
                  <TableCell className="text-gray-700">{student.year}</TableCell>
                  <TableCell className="text-gray-700">{student.domain}</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
                      {student.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleVerify(student.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Verify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600 px-2">Previous</span>

              {renderPaginationButtons().map((page, index) =>
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-600">
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
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200'
                        : ''
                    }`}
                  >
                    {page}
                  </Button>
                ),
              )}

              <span className="text-sm text-gray-600 px-2">Next</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2"
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

export default PendingVerifications;
