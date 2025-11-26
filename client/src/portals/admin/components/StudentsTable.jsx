import React, { useState } from 'react';
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
import { ChevronDown, Download, Pencil, DollarSign } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { toast } from 'sonner';
import { Toaster } from '@/common/components/ui/sonner';

const StudentsTable = ({ data = [] }) => {
  const getProgressColor = progress => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-blue-400';
    return 'bg-zinc-500';
  };

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

    const handleStatusChange = (newStatus) => {
      setCurrentStatus(newStatus);
      toast.success(`Capstone status updated to ${newStatus} for ${student.studentName}`);

      // Call your API or parent component handler
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

    const handlePaymentStatusChange = (newStatus) => {
      setCurrentStatus(newStatus);
      toast.success(`Payment status updated to ${newStatus} for ${student.studentName}`);

      // Call your API or parent component handler
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

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // Add your CSV export logic here
  };

  // const handleIssueCertificate = studentName => {
  //   console.log('Issuing certificate for:', studentName);
  //   // Add your certificate logic here
  // };
  const [openCertificatePopoverId, setOpenCertificatePopoverId] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null); // For verify popover

  const handleIssueCertificate = (student) => {
    setOpenCertificatePopoverId(null);

    toast.success("Certificate is being issued", {
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


  return (
    <div className="w-full ">
      <Toaster position="top-center" />
      {/* Filter Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                All Colleges
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                Stanford University
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">MIT</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                Harvard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
              >
                Filter by Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                Graded
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                Submitted
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">
                In Progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-800 border-zinc-700 hover:bg-zinc-800">
              <TableHead className="font-semibold text-zinc-300">NAME</TableHead>
              <TableHead className="font-semibold text-zinc-300">EMAIL</TableHead>
              <TableHead className="font-semibold text-zinc-300">COLLEGE</TableHead>
              <TableHead className="font-semibold text-zinc-300">YEAR</TableHead>
              <TableHead className="font-semibold text-zinc-300">PAYMENT STATUS ₹</TableHead>
              <TableHead className="font-semibold text-zinc-300">CAPSTONE STATUS</TableHead>
              <TableHead className="font-semibold text-zinc-300">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((student, index) => (
                <TableRow key={index} className="hover:bg-zinc-800 border-zinc-800">
                  <TableCell className="font-medium text-zinc-100">{student.name}</TableCell>
                  <TableCell className="text-zinc-300">{student.email}</TableCell>
                  <TableCell className="text-zinc-200">{student.college}</TableCell>
                  <TableCell className="text-zinc-200">{student.year}</TableCell>
                  <TableCell>
                    <PaymentStatusCell
                      student={student}
                      onPaymentStatusUpdate={(studentId, newStatus) => {
                        // Your API call or state update logic
                        console.log(`Update student ${studentId} payment to ${newStatus}`);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <CapstoneStatusCell
                      student={student}
                      onStatusUpdate={(studentId, newStatus) => {
                        // Your API call or state update logic
                        console.log(`Update student ${studentId} to ${newStatus}`);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openCertificatePopoverId === index}
                      onOpenChange={(open) => setOpenCertificatePopoverId(open ? index : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Issue Certificate
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-96 bg-zinc-900 border-zinc-800 text-white">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-bold text-lg flex items-center gap-2">
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
                            </h4>
                            <p className="text-sm text-zinc-400">
                              Review the project details before issuing the certificate
                            </p>
                          </div>

                          <div className="space-y-3 py-3 border-y border-zinc-800">
                            <div className="space-y-1">
                              <span className="text-xs text-zinc-500 uppercase font-bold">Student Name</span>
                              <p className="font-medium text-base">{student.name}</p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs text-zinc-500 uppercase font-bold">GitHub Repository</span>
                              <a
                                href={student.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm hover:underline"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                {student.githubLink}
                              </a>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs text-zinc-500 uppercase font-bold">Live Project Link</span>
                              <a
                                href={student.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm hover:underline"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {student.liveLink}
                              </a>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-zinc-500 uppercase font-bold">Payment ID</span>
                              <div className="flex flex-row items-center gap-2">
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-mono">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  {student.paymentId || "TXN_123456789"}
                                </div>
                                <button
                                  onClick={() => navigator.clipboard.writeText(student.paymentId || "TXN_123456789")}
                                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                  title="Copy Payment ID"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setOpenCertificatePopoverId(null)}
                              className="flex-1 border-zinc-700 text-zinc-400 hover:bg-red-400 hover:text-white"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleIssueCertificate(student)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              Issue
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-zinc-400">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentsTable;
