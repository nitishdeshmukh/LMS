import {
  Code,
  Database,
  Smartphone,
  BrainCircuit,
  BarChart3,
  Layout,
  Server,
  FileCode2,
  Palette,
  GitBranch,
} from 'lucide-react';

export const COURSE_ICON_MAP = {
  'Full Stack Web Development': Code,
  'Data Science & AI': BrainCircuit,
  'Mobile App Development': Smartphone,
  'Data Analytics': BarChart3,
  'FrontEnd Development': Layout,
  'BackEnd Development': Server,
  Database: Database,
  'Python with Django + Flask': FileCode2,
  'UI/UX Design': Palette,
  'Version Control with Git & GitHub': GitBranch,
};

export const getCourseIcon = (courseName, className = 'w-8 h-8 text-blue-400') => {
  const IconComponent = COURSE_ICON_MAP[courseName] || Code;
  return IconComponent;
};

export const getSlotStatus = level => {
  const statusMap = {
    Beginner: 'Open',
    Intermediate: 'Filling Fast',
    Advanced: 'Limited Seats',
  };
  return statusMap[level] || 'Open';
};
