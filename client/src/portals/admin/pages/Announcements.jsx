import React, { useState } from 'react';
import { CirclePlus, Pencil, Trash2, ChevronDown, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../common/components/ui/dropdown-menu';
import { Button } from '@/common/components/ui/button';

const initialAnnouncements = [
  {
    id: 1,
    title: 'New Course: Advanced JavaScript',
    content:
      'We are thrilled to announce the launch of our new "Advanced JavaScript" course. This course...',
    status: 'Published',
    date: 'Oct 26, 2023',
    author: 'Admin',
  },
  {
    id: 2,
    title: 'Scheduled Maintenance',
    content:
      'Please be advised that the student portal will be temporarily unavailable for scheduled...',
    status: 'Draft',
    date: 'Oct 25, 2023',
    author: 'Admin',
  },
  {
    id: 3,
    title: 'Welcome to the New Portal!',
    content:
      "Welcome to the new and improved Code2Dbg Student Portal! We've redesigned the experience to make i...",
    status: 'Published',
    date: 'Sep 15, 2023',
    author: 'Admin',
  },
];

const statusOptions = ['Published', 'Draft'];
const sortByOptions = ['Latest', 'Oldest', 'Title'];

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null); // Changed to null for placeholder
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filterStatus, setFilterStatus] = useState(null); // Changed to null
  const [sortBy, setSortBy] = useState(null); // Changed to null
  const [editingId, setEditingId] = useState(null);

  const handleContinue = () => {
    if (!title || !content || !status) return;

    if (editingId) {
      // Update existing announcement
      setAnnouncements(
        announcements.map(a =>
          a.id === editingId
            ? {
                ...a,
                title,
                content,
                status,
              }
            : a,
        ),
      );
      setEditingId(null);
    } else {
      // Create new announcement
      setAnnouncements([
        ...announcements,
        {
          id: announcements.length + 1,
          title,
          content,
          status,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          author: 'Admin',
        },
      ]);
    }

    // Reset form
    setTitle('');
    setContent('');
    setStatus(null);
  };

  const handleEdit = id => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setStatus(announcement.status);
      setEditingId(id);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setStatus(null);
    setEditingId(null);
  };

  const handleDelete = id => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    // If deleting the announcement being edited, clear the form
    if (editingId === id) {
      handleCancel();
    }
  };

  const filteredAnnouncements = announcements.filter(a =>
    filterStatus ? a.status === filterStatus : true,
  );

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (!sortBy || sortBy === 'Latest') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'Oldest') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'Title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* New/Edit Announcement Form */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow p-6 mb-10">
        <h2 className="font-bold text-lg mb-5 text-zinc-100">
          {editingId ? 'Edit Announcement' : 'Create a New Announcement'}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
            <input
              className="w-full border border-zinc-700 bg-zinc-900 text-zinc-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
              placeholder="Enter announcement title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Status</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between bg-zinc-900 border-zinc-700 hover:bg-zinc-800 py-5"
                >
                  <span className={status ? 'text-zinc-200' : 'text-zinc-400'}>
                    {status || 'Choose Status'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-zinc-800 border-zinc-700">
                {statusOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => setStatus(option)}
                    className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
          <textarea
            className="w-full border border-zinc-700 bg-zinc-900 text-zinc-100 rounded-lg p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-500"
            placeholder="Write your announcement here..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleContinue} className="bg-blue-600 text-white hover:bg-blue-700">
            {editingId ? 'Update Announcement' : 'Continue'}
          </Button>
          {editingId && (
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-zinc-700 text-zinc-700 hover:shadow-2xl"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 min-w-[160px] justify-between"
              >
                <span className={filterStatus ? 'text-zinc-200' : 'text-zinc-400'}>
                  {filterStatus || 'Filter by Status'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              {statusOptions.map(option => (
                <DropdownMenuItem
                  key={option}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  onSelect={() => setFilterStatus(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
              {filterStatus && (
                <>
                  <div className="h-px bg-zinc-700 my-1" />
                  <DropdownMenuItem
                    className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                    onSelect={() => setFilterStatus(null)}
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort By Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 min-w-[160px] justify-between"
              >
                <span className={sortBy ? 'text-zinc-200' : 'text-zinc-400'}>
                  {sortBy ? `Sort by: ${sortBy}` : 'Sort by'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              {sortByOptions.map(option => (
                <DropdownMenuItem
                  key={option}
                  className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                  onSelect={() => setSortBy(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
              {sortBy && (
                <>
                  <div className="h-px bg-zinc-700 my-1" />
                  <DropdownMenuItem
                    className="text-zinc-400 hover:bg-zinc-700 cursor-pointer"
                    onSelect={() => setSortBy(null)}
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Existing Announcements */}
      <h2 className="font-bold text-lg mb-4 text-zinc-100">Existing Announcements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sortedAnnouncements.map(a => (
          <div
            key={a.id}
            className={`bg-zinc-800 border ${
              editingId === a.id ? 'border-blue-500' : 'border-zinc-700'
            } rounded-2xl shadow p-4 flex flex-col hover:border-zinc-600 transition-all`}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-semibold text-zinc-100">{a.title}</div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-xs rounded-lg font-semibold border
                  ${
                    a.status === 'Published'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}
                >
                  {a.status}
                </span>

                {/* Dropdown Menu for Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-zinc-700 p-1 rounded transition-colors text-zinc-300">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem
                      onSelect={() => handleEdit(a.id)}
                      className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                    >
                      <Pencil size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleDelete(a.id)}
                      className="text-red-400 hover:bg-zinc-700 focus:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="text-sm text-zinc-300 mb-4 line-clamp-3">{a.content}</div>
            <div className="text-xs text-zinc-500 mt-auto pt-2">
              <span>
                Posted by {a.author} on {a.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

