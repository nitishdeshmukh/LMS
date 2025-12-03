'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
import adminService from '@/services/admin/adminService';
import { cn } from '@/common/lib/utils';

const Courses = () => {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'date',
    status: 'all',
  });

  // API State
  const [coursesData, setCoursesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses data
  const fetchCourses = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await adminService.getAllCourses();

      if (response.success) {
        // Transform API data to match component structure
        const transformedData = response.data.courses.map(course => ({
          id: course._id,
          courseId: course._id,
          title: course.title,
          category: course.stream,
          modules: course.modules?.length,
          status: course.isPublished ? 'Published' : 'Draft',
          instructor: course.instructor,
          price: course.price,
          thumbnail:
            course.thumbnail ||
            course.coverImage ||
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
          description: course.description,
          students: course.enrolledStudents || 0,
          slug: course.slug,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
        }));

        setCoursesData(transformedData);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchCourses(false);
  };

  const handleEdit = course => {
    setSelectedCourse(course);
    setView('edit');
  };

  const handleDelete = async courseId => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete this course? This action cannot be undone.',
      );

      if (!confirmed) return;

      toast.loading('Deleting course...', { id: 'delete-course' });

      const response = await adminService.deleteCourse(courseId);

      if (response.success) {
        toast.success('Course deleted successfully', {
          id: 'delete-course',
          description: 'The course has been permanently removed',
        });

        // Refresh courses list
        await fetchCourses(false);
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error('Failed to delete course', {
        id: 'delete-course',
        description: err.message || 'Please try again later',
      });
    }
  };

  const handleBackToCourses = () => {
    setView('list');
    setSelectedCourse(null);
    fetchCourses(false); // Refresh courses list when coming back
  };

  // Apply filters and search
  const getFilteredCourses = () => {
    let filtered = coursesData.filter(
      course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(
        course => course.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    // Sort courses
    switch (filters.sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'students':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Course Management</h1>
            <p className="text-zinc-400 text-sm mt-1">Create, edit, and manage your courses</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            variant="outline"
            className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="mt-2 text-red-400 border-red-500/20 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        )}

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
              className="w-full px-4 pl-10 py-1.5 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder:text-zinc-400"
              disabled={isLoading}
            />
          </div>

          {/* Sort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                disabled={isLoading}
              >
                Sort by:{' '}
                {filters.sortBy === 'date'
                  ? 'Date'
                  : filters.sortBy === 'title'
                    ? 'Title'
                    : 'Students'}
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'date' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'title' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, sortBy: 'students' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Students
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                disabled={isLoading}
              >
                Status:{' '}
                {filters.status === 'all'
                  ? 'All'
                  : filters.status === 'published'
                    ? 'Published'
                    : 'Draft'}
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'published' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilters({ ...filters, status: 'draft' })}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Course Button */}
          <Button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-zinc-400">Loading courses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Total Courses</p>
                <p className="text-2xl font-bold text-white mt-1">{coursesData.length}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {coursesData.filter(c => c.status === 'Published').length}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  {coursesData.filter(c => c.status === 'Draft').length}
                </p>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <div
                  key={course.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group"
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-80"
                      onError={e => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400';
                      }}
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
                      <span className="text-xs text-zinc-500 font-mono truncate">
                        {course.courseId || course.id}
                      </span>
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
                    <p className="text-sm text-zinc-400 mb-1">{course.category}</p>
                    <p className="text-sm text-zinc-500 mb-3">
                      {course.modules} Modules • {course.students} Students
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-400">₹{course.price}</span>
                      <Button
                        onClick={() => handleEdit(course)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg mb-2">No courses found</p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="mt-2 border-zinc-700 text-zinc-300"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;

