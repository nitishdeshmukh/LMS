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

export default function Announcements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Published');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Latest');

  const handlePublish = () => {
    if (!title || !content) return;
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
    setTitle('');
    setContent('');
    setStatus('Published');
  };

  const handleEdit = id => {
    console.log('Edit announcement:', id);
  };

  const handleDelete = id => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const filteredAnnouncements = announcements.filter(a =>
    filterStatus === 'All Status' ? true : a.status === filterStatus,
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">

      {/* New Announcement Form */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow p-6 mb-10">
        <h2 className="font-bold text-lg mb-5 text-zinc-100">Create a New Announcement</h2>
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
                <Button variant="outline" className="w-full flex items-center justify-between bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800">
                  {status}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-zinc-800 border-zinc-700">
                <DropdownMenuItem onClick={() => setStatus('Published')} className="text-zinc-200 hover:bg-zinc-700">
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus('Draft')} className="text-zinc-200 hover:bg-zinc-700">
                  Draft
                </DropdownMenuItem>
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
        <Button onClick={handlePublish} className="bg-blue-600 text-white hover:bg-blue-700">
          Publish Announcement
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                {filterStatus}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem onClick={() => setFilterStatus('All Status')} className="text-zinc-200 hover:bg-zinc-700">
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Published')} className="text-zinc-200 hover:bg-zinc-700">
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Draft')} className="text-zinc-200 hover:bg-zinc-700">
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                Sort by: {sortBy}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem onClick={() => setSortBy('Latest')} className="text-zinc-200 hover:bg-zinc-700">
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('Oldest')} className="text-zinc-200 hover:bg-zinc-700">
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('Title')} className="text-zinc-200 hover:bg-zinc-700">
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Existing Announcements */}
      <h2 className="font-bold text-lg mb-4 text-zinc-100">Existing Announcements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredAnnouncements.map(a => (
          <div key={a.id} className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow p-4 flex flex-col hover:border-zinc-600 transition-all">
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
                    <DropdownMenuItem onClick={() => handleEdit(a.id)} className="text-zinc-200 hover:bg-zinc-700">
                      <Pencil size={14} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(a.id)}
                      className="text-red-400 hover:bg-zinc-700 focus:text-red-400"
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
