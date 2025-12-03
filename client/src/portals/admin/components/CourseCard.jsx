import React, { useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Badge } from '@/common/components/ui/badge';

const CourseCard = React.memo(({ course, onEdit, onDelete, onToggleStatus }) => {
  const handleEdit = useCallback(() => onEdit(course), [course, onEdit]);
  const handleDelete = useCallback(() => onDelete(course.id), [course.id, onDelete]);
  const handleToggle = useCallback(() => onToggleStatus(course), [course, onToggleStatus]);
  const handleImageError = useCallback(e => {
    e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400';
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
      {/* Course Thumbnail */}
      <div className="relative h-40 bg-linear-to-br from-blue-500 to-purple-600 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover opacity-80"
          onError={handleImageError}
          loading="lazy"
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
                onClick={handleEdit}
                className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
              >
                Edit Course
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleToggle}
                className="text-blue-400 hover:bg-zinc-700 cursor-pointer"
              >
                {course.status === 'Published' ? 'Unpublish' : 'Publish'} Course
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
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
            onClick={handleEdit}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
