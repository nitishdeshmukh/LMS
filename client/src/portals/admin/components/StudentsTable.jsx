import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../common/components/ui/table';
import { Badge } from '../../../common/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../common/components/ui/dropdown-menu';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

const StudentsTable = ({ data = [] }) => {
  const getProgressColor = progress => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-blue-400';
    return 'bg-zinc-500';
  };

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
              <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                Filter by College
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">All Colleges</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">Stanford University</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">MIT</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">Harvard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                Filter by Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">All Status</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">Graded</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">Submitted</DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-200 hover:bg-zinc-700">In Progress</DropdownMenuItem>
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
              <TableHead className="font-semibold text-zinc-300">CURRENT PROGRESS %</TableHead>
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
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px]">
                        <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              student.currentProgress,
                            )} transition-all`}
                            style={{ width: `${student.currentProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {student.currentProgress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusBadgeVariant(student.capstoneStatus)} font-medium border`}
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
