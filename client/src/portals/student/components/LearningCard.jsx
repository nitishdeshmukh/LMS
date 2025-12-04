import { memo, useCallback, useMemo } from 'react';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';

const LearningCard = memo(({ course, destination }) => {
  const navigate = useNavigateWithRedux();

  // Memoize the navigation handler
  const handleClick = useCallback(() => {
    navigate(`/student/${destination}`);
  }, [navigate, destination]);

  // Determine if we should show a gradient background or an image
  const hasImageUrl = useMemo(
    () => course.thumbnail && course.thumbnail.startsWith('http'),
    [course.thumbnail],
  );

  // Memoize progress bar color
  const progressBarClass = useMemo(
    () =>
      `h-1.5 sm:h-2 rounded-full transition-all duration-500 ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`,
    [course.progress],
  );

  // Memoize thumbnail style
  const thumbnailStyle = useMemo(
    () =>
      hasImageUrl
        ? {
            backgroundImage: `url(${course.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {},
    [hasImageUrl, course.thumbnail],
  );

  // Memoize thumbnail class
  const thumbnailClass = useMemo(
    () =>
      `h-32 sm:h-40 w-full relative p-4 sm:p-6 flex flex-col justify-between ${!hasImageUrl ? course.image : ''}`,
    [hasImageUrl, course.image],
  );

  return (
    <div
      onClick={handleClick}
      className="group block bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Course Thumbnail / Glimpse */}
      <div className={thumbnailClass} style={thumbnailStyle}>
        {/* Overlay for image thumbnails */}
        {hasImageUrl && (
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        )}

        <div className="bg-black/40 backdrop-blur-md p-2 sm:p-3 rounded-lg sm:rounded-xl w-fit border border-white/10 relative z-10">
          {course.icon}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 relative z-10">
          <div className="flex items-center text-[10px] sm:text-xs font-bold text-white/80 bg-black/40 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full w-fit">
            <Clock size={10} className="mr-1 sm:mr-2 shrink-0" />
            <span className="truncate">Last: {course.lastAccessed}</span>
          </div>
          {course.progress === 100 && (
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-green-400 bg-green-900/40 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full w-fit">
              <CheckCircle size={10} className="mr-1 shrink-0" />
              <span className="hidden xs:inline">Completed</span>
              <span className="xs:hidden">Done</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-white group-hover:text-blue-400 transition-colors line-clamp-2 sm:line-clamp-1">
          {course.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-[10px] sm:text-xs text-zinc-500 mb-1.5 sm:mb-2">
            <span>{course.progress}% Complete</span>
            <span>
              {course.completed}/{course.total} {course.type}
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div className={progressBarClass} style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        <button className="w-full bg-zinc-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium group-hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
          <PlayCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
          {course.buttonText}
        </button>
      </div>
    </div>
  );
});

LearningCard.displayName = 'LearningCard';

export default LearningCard;
