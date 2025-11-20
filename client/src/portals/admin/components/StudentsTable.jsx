import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown, Download } from 'lucide-react';

const StudentsTable = ({ data = [] }) => {
  const getProgressColor = progress => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-blue-400';
    return 'bg-gray-400';
  };

  const getStatusBadgeVariant = status => {
    switch (status) {
      case 'Graded':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // Add your CSV export logic here
  };

  const handleIssueCertificate = studentName => {
    console.log('Issuing certificate for:', studentName);
    // Add your certificate logic here
  };

  return (
    <div className="w-full ">
      {/* Filter Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex text-black items-center gap-2">
                Filter by College
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger  >
            <DropdownMenuContent className='text-black bg-white ' >
              <DropdownMenuItem>All Colleges</DropdownMenuItem>
              <DropdownMenuItem>Stanford University</DropdownMenuItem>
              <DropdownMenuItem>MIT</DropdownMenuItem>
              <DropdownMenuItem>Harvard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex  text-black items-center gap-2">
                Filter by Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-black bg-white' >
              <DropdownMenuItem>All Status</DropdownMenuItem>
              <DropdownMenuItem>Graded</DropdownMenuItem>
              <DropdownMenuItem>Submitted</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
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
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">NAME</TableHead>
              <TableHead className="font-semibold text-gray-600">EMAIL</TableHead>
              <TableHead className="font-semibold text-gray-600">COLLEGE</TableHead>
              <TableHead className="font-semibold text-gray-600">YEAR</TableHead>
              <TableHead className="font-semibold text-gray-600">CURRENT PROGRESS %</TableHead>
              <TableHead className="font-semibold text-gray-600">CAPSTONE STATUS</TableHead>
              <TableHead className="font-semibold text-gray-600">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((student, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{student.name}</TableCell>
                  <TableCell className="text-gray-600">{student.email}</TableCell>
                  <TableCell className="text-gray-700">{student.college}</TableCell>
                  <TableCell className="text-gray-700">{student.year}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px]">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              student.currentProgress,
                            )} transition-all`}
                            style={{ width: `${student.currentProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {student.currentProgress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusBadgeVariant(student.capstoneStatus)} font-medium`}
                    >
                      {student.capstoneStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleIssueCertificate(student.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Issue Certificate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
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
