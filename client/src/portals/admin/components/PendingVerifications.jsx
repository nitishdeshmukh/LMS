import React, { useState } from 'react';
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
import { ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { toast } from 'sonner';
import { Toaster } from '@/common/components/ui/sonner';


const PendingVerifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVerifyPopoverOpen, setIsVerifyPopoverOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const handleVerifyStudent = (studentData) => {
    // Close the popover
    setIsVerifyPopoverOpen(false);
    setOpenPopoverId(null);

    // Show toast notification
    toast.success("Sending email to the student", {
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

    // Your API call to verify student here
    // await verifyStudentPayment(studentData);
  };

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
    <div className="p-8 min-h-screen">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-sm border border-zinc-700">
          <div className="flex items-center gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                >
                  Filter by College
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, college: 'All' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  All Colleges
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, college: 'IIT Bombay' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  IIT Bombay
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, college: 'NIT Trichy' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  NIT Trichy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, college: 'BITS Pilani' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  BITS Pilani
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                >
                  Filter by Year
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, year: 'All' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  All Years
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, year: 'Second Year' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Second Year
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, year: 'Third Year' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Third Year
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, year: 'Final Year' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Final Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                >
                  Filter by Domain
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'All' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  All Domains
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Data Science' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Data Science
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Web Development' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Web Development
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, domain: 'Machine Learning' })}
                  className="text-zinc-200 hover:bg-zinc-700"
                >
                  Machine Learning
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
                <TableHead className="font-semibold text-zinc-300">Name</TableHead>
                <TableHead className="font-semibold text-zinc-300">Email</TableHead>
                <TableHead className="font-semibold text-zinc-300">College</TableHead>
                <TableHead className="font-semibold text-zinc-300">Year</TableHead>
                <TableHead className="font-semibold text-zinc-300">Domain</TableHead>
                <TableHead className="font-semibold text-zinc-300">Payment Status</TableHead>
                <TableHead className="font-semibold text-zinc-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(student => (
                <TableRow key={student.id} className="hover:bg-zinc-800 border-zinc-800">
                  <TableCell className="font-medium text-zinc-100">{student.name}</TableCell>
                  <TableCell className="text-blue-400">{student.email}</TableCell>
                  <TableCell className="text-blue-400">{student.college}</TableCell>
                  <TableCell className="text-zinc-200">{student.year}</TableCell>
                  <TableCell className="text-zinc-200">{student.domain}</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20">
                      {student.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openPopoverId === student.id}
                      onOpenChange={(open) => setOpenPopoverId(open ? student.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
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
                              onClick={() => setOpenPopoverId(null)} // ✅ This closes the popover
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
                    className={`px-4 py-2 ${currentPage === page
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                      }`}
                  >
                    {page}
                  </Button>
                ),
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

export default PendingVerifications;
