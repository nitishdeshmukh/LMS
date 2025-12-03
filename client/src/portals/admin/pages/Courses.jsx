'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Plus, MoreVertical, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import CreateCourse from '../components/CreateCourse';
import PasswordModal from '../components/PasswordModal';
import adminService from '@/services/admin/adminService';
import { cn } from '@/common/lib/utils';
import Counter from '../../public/components/Counter';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const [view, setView] = useState('list');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState(null);
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

  // Transform course data - memoized to avoid recalculation
  const transformCourseData = useCallback(courses => {
    return courses.map(course => ({
      id: course._id,
      courseId: course._id,
      title: course.title,
      category: course.stream,
      modules: course.modules?.length || 0,
      status: course.isPublished ? 'Published' : 'Draft',
      instructor: course.instructor,
      price: course.price,
      thumbnail:
        course.thumbnail ||
        course.coverImage ||
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      description: course.description,
      students: course.students || 0,
      slug: course.slug,
      level: course.level,
      discountedPrice: course.discountedPrice,
      totalDuration: course.totalDuration,
      tags: course.tags,
      difficultyIndex: course.difficultyIndex,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));
  }, []);

  // Fetch courses data - memoized
  const fetchCourses = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        setError(null);

        const response = await adminService.getAllCourses();

        if (response.success) {
          const transformedData = transformCourseData(response.data.courses);
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
    },
    [transformCourseData],
  );

  // Fetch on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Manual refresh handler - memoized
  const handleRefresh = useCallback(() => {
    fetchCourses(false);
  }, [fetchCourses]);

  // Edit handler - memoized
  const handleEdit = useCallback(course => {
    setSelectedCourse(course);
    setView('create');
  }, []);

  // Delete handler - memoized
  const handleDelete = useCallback(
    async courseId => {
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
    },
    [fetchCourses],
  );

  // Toggle status handler - memoized
  const handleToggleStatus = useCallback(course => {
    setCourseToToggle(course);
    setIsPasswordModalOpen(true);
  }, []);

  const handlePasswordSubmit = async password => {
    if (!courseToToggle) return;

    try {
      await adminService.verifyAdmin(password);


      const isPublished = courseToToggle.status === 'Published';
      const newStatus = !isPublished;
      const statusLabel = newStatus ? 'Publish' : 'Unpublish';

      toast.loading(`${statusLabel}ing course...`, { id: 'toggle-status' });

      const response = await adminService.toggleCourseStatus(courseToToggle.id, {
        isPublished: newStatus,
      });

      if (response.success) {
        toast.success(`Course ${statusLabel}ed Successfully`, {
          id: 'toggle-status',
          description: `"${courseToToggle.title}" is now ${
            newStatus ? 'published' : 'unpublished'
          }`,
        });

        await fetchCourses(false);
        setCourseToToggle(null);
        setIsPasswordModalOpen(false); // Close modal on success
      } else {
        throw new Error(response.message || `Failed to ${statusLabel.toLowerCase()} course`);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      const errorMessage = err.response?.data?.message;
      toast.error('Action Failed', {
        id: 'toggle-status',
        description: errorMessage,
      });
    }
  };

  // Back handler - memoized
  const handleBackToCourses = useCallback(() => {
    setView('list');
    setSelectedCourse(null);
    fetchCourses(false);
  }, [fetchCourses]);

  // Create new course handler - memoized
  const handleCreateNew = useCallback(() => {
    setSelectedCourse(null);
    setView('create');
  }, []);

  // Filter courses - memoized
  const filteredCourses = useMemo(() => {
    let filtered = coursesData.filter(
      course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (filters.status !== 'all') {
      filtered = filtered.filter(
        course => course.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

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
  }, [coursesData, searchQuery, filters]);

  // Course stats - memoized
  const courseStats = useMemo(() => {
    return {
      total: coursesData.length,
      published: coursesData.filter(c => c.status === 'Published').length,
      draft: coursesData.filter(c => c.status === 'Draft').length,
    };
  }, [coursesData]);

  // Filter handlers - memoized
  const handleSortChange = useCallback(sortBy => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const handleStatusChange = useCallback(status => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const handleSearchChange = useCallback(e => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  if (view === 'create') {
    return <CreateCourse onBack={handleBackToCourses} course={selectedCourse} />;
  }

  return (
    <React.Fragment>
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
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by course title or ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 pl-10 py-1.5 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder:text-zinc-400"
              disabled={isLoading}
            />
          </div>

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
                onClick={() => handleSortChange('date')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange('title')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange('students')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
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
                onClick={() => handleStatusChange('all')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('published')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('draft')}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            <Plus className="h-5 w-5" />
            Add Course
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-zinc-400">Loading courses...</p>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Total Courses</p>
                <p className="text-2xl font-bold text-white mt-1"><Counter target={courseStats.total} /></p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-400 mt-1"><Counter target={courseStats.published} /></p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1"><Counter target={courseStats.draft} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg mb-2">No courses found</p>
                {searchQuery && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="mt-2 border-zinc-700 text-zinc-300"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      </div>

      <PasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onSubmit={handlePasswordSubmit}
      />
    </React.Fragment>
  );
}
export default Courses;
