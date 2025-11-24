'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Badge } from '@/common/components/ui/badge';
import CreateCourse from '../components/CreateCourse';
import ManageCourse from '../components/ManageCourse';

const Courses = () => {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'date',
    status: 'all',
  });

  const coursesData = [
    {
      id: 'C2D-PY01',
      title: 'Introduction to Python',
      category: 'Web Development',
      modules: 12,
      status: 'Published',
      instructor: 'Dr. Ada Lovelace',
      price: 299.99,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      description: 'Learn Python from scratch with hands-on projects',
      students: 245,
    },
    {
      id: 'C2D-JS02',
      title: 'Advanced JavaScript',
      category: 'Web Development',
      modules: 15,
      status: 'Published',
      instructor: 'Dr. Ada Lovelace',
      price: 349.99,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
      description: 'Master advanced JavaScript concepts and patterns',
      students: 189,
    },
    {
      id: 'C2D-DS01',
      title: 'Data Structures & Algorithms',
      category: 'Computer Science',
      modules: 20,
      status: 'Draft',
      instructor: 'Prof. Alan Turing',
      price: 399.99,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400',
      description: 'Deep dive into DSA with coding challenges',
      students: 0,
    },
    {
      id: 'C2D-RE01',
      title: 'Frontend with React',
      category: 'Web Development',
      modules: 18,
      status: 'Published',
      instructor: 'Sarah Chen',
      price: 329.99,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      description: 'Build modern web apps with React and Redux',
      students: 312,
    },
    {
      id: 'C2D-NO01',
      title: 'Backend with Node.js',
      category: 'Backend Development',
      modules: 16,
      status: 'Draft',
      instructor: 'Mike Johnson',
      price: 319.99,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      description: 'Master backend development with Node.js and Express',
      students: 0,
    },
    {
      id: 'C2D-UX01',
      title: 'UI/UX Design Principles',
      category: 'Design',
      modules: 10,
      status: 'Published',
      instructor: 'Emily Davis',
      price: 279.99,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      description: 'Learn to create beautiful and intuitive interfaces',
      students: 156,
    },
  ];

  const handleEdit = course => {
    setSelectedCourse(course);
    setView('edit');
  };

  const handleDelete = courseId => {
    console.log('Deleting course:', courseId);
    // Add delete logic here
  };

  const handleBackToCourses = () => {
    setView('list');
    setSelectedCourse(null);
  };

  const filteredCourses = coursesData.filter(
    course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // If creating a new course
  if (view === 'create') {
    return <CreateCourse onBack={handleBackToCourses} />;
  }

  // If editing a course
  if (view === 'edit' && selectedCourse) {
    return <ManageCourse course={selectedCourse} onBack={handleBackToCourses} />;
  }

  // Main courses list view
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-full mx-auto">
        {/* Search, Filters, and Create Button */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by course title or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
              >
                Sort by: Date
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'date' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'title' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'students' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                Students
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
              >
                Status: All
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'published' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'draft' })}
                className="text-zinc-200 hover:bg-zinc-700"
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Course Button */}
          <Button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group"
            >
              {/* Course Thumbnail */}
              <div className="relative h-40 bg-linear-to-br from-blue-500 to-purple-600 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                      <DropdownMenuItem
                        onClick={() => handleEdit(course)}
                        className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                      >
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(course.id)}
                        className="text-red-400 hover:bg-zinc-700 cursor-pointer"
                      >
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 font-mono">{course.id}</span>
                  <Badge
                    className={
                      course.status === 'Published'
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20'
                    }
                  >
                    {course.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-zinc-100 mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-3">ID: {course.id}</p>
                <p className="text-sm text-zinc-500 mb-3">Modules: {course.modules}</p>

                <Button
                  onClick={() => handleEdit(course)}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Course
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
