import React, { useState, useEffect } from 'react';
import { ChevronDown, CalendarIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../common/components/ui/dropdown-menu';
import { Button } from '../../../common/components/ui/button';
import { Input } from '../../../common/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '../../../common/components/ui/popover';
import { Calendar } from '../../../common/components/ui/calendar';
import adminService from '@/services/admin/adminService';

const statusOptions = ['All Status', 'Graded', 'Submitted', 'In Progress'];

function formatDate(date) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const DashboardHeader = ({
  selectedCollege,
  setSelectedCollege,
  selectedStatus,
  setSelectedStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  const [collegeOptions, setCollegeOptions] = useState(['All Colleges']);

  // From Date UI State
  const [fromOpen, setFromOpen] = useState(false);
  const [fromMonth, setFromMonth] = useState(undefined);
  const [fromValue, setFromValue] = useState('');

  // To Date UI State
  const [toOpen, setToOpen] = useState(false);
  const [toMonth, setToMonth] = useState(undefined);
  const [toValue, setToValue] = useState('');

  // Fetch colleges list on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await adminService.getCollegesList();
        if (response.success && response.data) {
          setCollegeOptions(['All Colleges', ...response.data]);
        }
      } catch (error) {
        console.error('Failed to fetch colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  // Sync date value inputs with parent state
  useEffect(() => {
    setFromValue(fromDate ? formatDate(fromDate) : '');
  }, [fromDate]);

  useEffect(() => {
    setToValue(toDate ? formatDate(toDate) : '');
  }, [toDate]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* College Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 min-w-[170px] justify-between"
              >
                <span className={selectedCollege ? 'text-zinc-200' : 'text-zinc-400'}>
                  {selectedCollege || 'Filter by College'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              {collegeOptions.map(option => (
                <DropdownMenuItem
                  key={option}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  onClick={() =>
                    setSelectedCollege(option === 'All Colleges' ? null : option)
                  }
                >
                  {option}
                </DropdownMenuItem>
              ))}
              {selectedCollege && (
                <>
                  <div className="h-px bg-zinc-700 my-1" />
                  <DropdownMenuItem
                    className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => setSelectedCollege(null)}
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 min-w-[160px] justify-between"
              >
                <span className={selectedStatus ? 'text-zinc-200' : 'text-zinc-400'}>
                  {selectedStatus || 'Filter by Status'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              {statusOptions.map(option => (
                <DropdownMenuItem
                  key={option}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  onClick={() => setSelectedStatus(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
              {selectedStatus && (
                <>
                  <div className="h-px bg-zinc-700 my-1" />
                  <DropdownMenuItem
                    className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => setSelectedStatus(null)}
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          {/* From Date Picker */}
          <div className="relative flex gap-2">
            <Input
              id="from-date"
              value={fromValue}
              placeholder="From Date"
              className="bg-zinc-800 border-zinc-700 text-zinc-200 pr-10 min-w-[180px] placeholder:text-zinc-400"
              onChange={e => {
                const date = new Date(e.target.value);
                setFromValue(e.target.value);
                if (isValidDate(date)) {
                  setFromDate(date);
                  setFromMonth(date);
                } else if (e.target.value === '') {
                  setFromDate(undefined);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setFromOpen(true);
                }
              }}
            />
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="from-date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                >
                  <CalendarIcon className="size-3.5 text-zinc-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-zinc-800"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={fromDate}
                  captionLayout="dropdown"
                  month={fromMonth}
                  onMonthChange={setFromMonth}
                  onSelect={date => {
                    setFromDate(date);
                    setFromValue(formatDate(date));
                    setFromOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date Picker */}
          <div className="relative flex gap-2">
            <Input
              id="to-date"
              value={toValue}
              placeholder="To Date"
              className="bg-zinc-800 border-zinc-700 text-zinc-200 pr-10 min-w-[180px] placeholder:text-zinc-400"
              onChange={e => {
                const date = new Date(e.target.value);
                setToValue(e.target.value);
                if (isValidDate(date)) {
                  setToDate(date);
                  setToMonth(date);
                } else if (e.target.value === '') {
                  setToDate(undefined);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setToOpen(true);
                }
              }}
            />
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="to-date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                >
                  <CalendarIcon className="size-3.5 text-zinc-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 border-zinc-800"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={toDate}
                  captionLayout="dropdown"
                  month={toMonth}
                  onMonthChange={setToMonth}
                  onSelect={date => {
                    setToDate(date);
                    setToValue(formatDate(date));
                    setToOpen(false);
                  }}
                  disabled={date => fromDate && date < fromDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
