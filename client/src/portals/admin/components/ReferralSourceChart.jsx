import React, { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { Calendar } from '@/common/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import DoughnutChart from './DoughnutChart';

/**
 * Formats a date object into a readable string format
 */
function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Validates if a date object is valid
 */
function isValidDate(date) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

/**
 * ReferralSourceChart - Displays enrollment breakdown by source (Direct vs Referral)
 * Note: Currently uses mock data until backend endpoint is available
 * Has independent date filters for future API integration
 */
function ReferralSourceChart({ college }) {
  // Independent date filter state
  const [fromOpen, setFromOpen] = useState(false);
  const [fromDate, setFromDate] = useState(undefined);
  const [fromMonth, setFromMonth] = useState(undefined);
  const [fromValue, setFromValue] = useState('');

  const [toOpen, setToOpen] = useState(false);
  const [toDate, setToDate] = useState(undefined);
  const [toMonth, setToMonth] = useState(undefined);
  const [toValue, setToValue] = useState('');

  // Mock data - will be replaced when backend endpoint is available
  // TODO: Integrate with API when /api/admin/dashboard/referrals endpoint is created
  const data = [
    { category: 'Direct', value: 45, color: '#145efc' },
    { category: 'Referral', value: 25, color: '#FFB84D' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Referral vs Direct Enrollments</h2>
        <p className="text-sm text-zinc-400">
          Displays the split between enrollments via direct sign-up and referrals.
        </p>
      </div>

      {/* Independent Date Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* From Date Picker */}
        <div className="relative flex gap-2">
          <Input
            id="referral-from-date"
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
            id="referral-to-date"
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

      <DoughnutChart data={data} height={360} innerRadiusPercent={60} />
    </div>
  );
}

export default ReferralSourceChart;
