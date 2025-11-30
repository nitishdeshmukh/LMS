'use client';

import React, { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/ui/popover';
import { Calendar } from '@/common/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import OverallPerformanceMetrics from './OverallPerformanceMetrics';

/**
 * Formats a date object into a readable string format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string or empty string if invalid
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
 * @param {Date} date - The date to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidDate(date) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

/**
 * PerformanceMetricsChart - Displays overall performance metrics with date filtering
 * @param {Object} props - Component properties
 * @param {Array} props.data - Performance metrics data array
 * @param {number} props.height - Chart height in pixels
 */
function PerformanceMetricsChart({ data, height = 400 }) {
  const [fromOpen, setFromOpen] = useState(false);
  const [fromDate, setFromDate] = useState(undefined);
  const [fromMonth, setFromMonth] = useState(undefined);
  const [fromValue, setFromValue] = useState('');

  const [toOpen, setToOpen] = useState(false);
  const [toDate, setToDate] = useState(undefined);
  const [toMonth, setToMonth] = useState(undefined);
  const [toValue, setToValue] = useState('');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Overall Performance Metrics</h2>
        <p className="text-sm text-zinc-400">360° view of key performance indicators</p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* From Date Picker */}
        <div className="relative flex gap-2">
          <Input
            id="from-date-performance"
            value={fromValue}
            placeholder="From Date"
            className="bg-zinc-800 border-zinc-700 text-zinc-200 pr-10 min-w-[180px] placeholder:text-zinc-400"
            onChange={e => {
              const date = new Date(e.target.value);
              setFromValue(e.target.value);
              if (isValidDate(date)) {
                setFromDate(date);
                setFromMonth(date);
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
            id="to-date-performance"
            value={toValue}
            placeholder="To Date"
            className="bg-zinc-800 border-zinc-700 text-zinc-200 pr-10 min-w-[180px] placeholder:text-zinc-400"
            onChange={e => {
              const date = new Date(e.target.value);
              setToValue(e.target.value);
              if (isValidDate(date)) {
                setToDate(date);
                setToMonth(date);
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

      <OverallPerformanceMetrics data={data} height={height} />
    </div>
  );
}

export default PerformanceMetricsChart;
