'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { courseFormSchema } from '@/portals/admin/validations/courseValidation';
import { useModules } from '@/portals/admin/hooks/useModules';
import { useCapstoneProjects } from '@/portals/admin/hooks/useCapstoneProjects';
import { CourseDetailsForm } from './CourseDetailsForm';
import { CourseModuleCard } from './CourseModuleCard';
import { CourseCapstoneProjectCard } from './CourseCapstoneProjectCard';
import adminService from '@/services/admin/adminService';

const CreateCourse = ({ onBack, course = null }) => {
  const isEditMode = !!course;

  const moduleHooks = useModules();
  const capstoneHooks = useCapstoneProjects();

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      stream: '',
      level: 'Beginner',
      price: '',
      discountedPrice: '',
      instructor: '',
      totalDuration: '',
      tags: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && course) {
      // Reset form with course data
      form.reset({
        title: course.title || '',
        description: course.description || '',
        stream: course.category || course.stream || '',
        level: course.level || 'Beginner',
        price: course.price?.toString() || '',
        discountedPrice: course.discountedPrice?.toString() || '',
        instructor: course.instructor || '',
        totalDuration: course.totalDuration || '',
        tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
      });

      // Fetch full course data with modules and capstone
      fetchCourseData(course.id);
    }
  }, [course, isEditMode, form]);

  const fetchCourseData = async courseId => {
    try {
      const response = await adminService.getCourseById(courseId);

      if (response.success && response.data) {
        const fullCourse = response.data;

        // Populate modules (if they exist)
        if (fullCourse.modules && fullCourse.modules.length > 0) {
          moduleHooks.setModules(
            fullCourse.modules.map(mod => ({
              id: mod._id || Date.now() + Math.random(),
              title: mod.title || '',
              maxTimelineInDays: mod.maxTimelineInDays || 7,
              description: mod.description || '',
              textLinks: mod.textLinks?.length > 0 ? mod.textLinks : [''],
              videoLinks: mod.videoLinks?.length > 0 ? mod.videoLinks : [''],
              tasks:
                mod.tasks?.map(task => ({
                  id: task._id || Date.now() + Math.random(),
                  title: task.title || '',
                  description: task.description || '',
                })) || [],
              quizzes:
                mod.quizzes?.map(quiz => ({
                  id: quiz._id || Date.now() + Math.random(),
                  title: quiz.title || '',
                  questions:
                    quiz.questions?.map(q => ({
                      id: q._id || Date.now() + Math.random(),
                      questionText: q.questionText || '',
                      options: q.options || ['', '', '', ''],
                      correctAnswer: q.correctAnswer || 0,
                    })) || [],
                })) || [],
            })),
          );
        } else {
          // Initialize with empty module if none exist
          moduleHooks.setModules([
            {
              id: Date.now(),
              title: '',
              maxTimelineInDays: 7,
              description: '',
              textLinks: [''],
              videoLinks: [''],
              tasks: [],
              quizzes: [],
            },
          ]);
        }

        // Populate capstone project (if it exists)
        if (fullCourse.capstoneProject && fullCourse.capstoneProject.title) {
          capstoneHooks.setCapstoneProjects([
            {
              id: Date.now(), // API doesn't return _id for capstone
              title: fullCourse.capstoneProject.title || '',
              description: fullCourse.capstoneProject.description || '',
              // ⚠️ API doesn't have requirements/deliverables - initialize empty
              requirements: [''],
              deliverables: [''],
              // Map isCapstoneCompleted to isLocked
              isLocked: fullCourse.capstoneProject.isCapstoneCompleted || false,
            },
          ]);
        } else {
          // Initialize with empty capstone if none exists
          capstoneHooks.setCapstoneProjects([
            {
              id: Date.now(),
              title: '',
              description: '',
              requirements: [''],
              deliverables: [''],
              isLocked: false,
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data', {
        description: error.message || 'Please try again',
      });
    }
  };

  const onSubmit = async values => {
    try {
      console.log('Form submission started with values:', values);

      // Validate required fields
      if (!values.title?.trim() || !values.description?.trim() || !values.stream || !values.price) {
        toast.error('Validation Error', {
          description:
            'Please fill in all required fields (Title, Description, Stream, Instructor, Price)',
        });
        return;
      }

      // Build modules data in the correct format
      const modulesData = moduleHooks.modules
        .filter(module => module.title?.trim() !== '') // Only include modules with titles
        .map((module, index) => ({
          title: module.title,
          maxTimelineInDays: module.maxTimelineInDays ? parseInt(module.maxTimelineInDays) : 7,
          description: module.description,
          textLinks: module.textLinks.filter(link => link.trim() !== ''),
          videoLinks: module.videoLinks.filter(link => link.trim() !== ''),
          quizzes: module.quizzes
            .filter(quiz => quiz.title?.trim() !== '')
            .map(quiz => ({
              title: quiz.title,
              questions: quiz.questions
                .filter(q => q.questionText?.trim() !== '')
                .map(q => ({
                  questionText: q.questionText,
                  options: q.options.filter(opt => opt.trim() !== ''),
                  correctAnswer: q.correctAnswer,
                })),
              status: 'Locked',
            })),
          tasks: module.tasks
            .filter(task => task.title?.trim() !== '')
            .map(task => ({
              title: task.title,
              description: task.description,
              status: 'Locked',
            })),
          order: index + 1,
          status: 'Locked',
        }));

      // Build capstone project data
      const capstoneProject = capstoneHooks.capstoneProjects[0];
      const capstoneProjectData =
        capstoneProject && capstoneProject.title?.trim()
          ? {
              title: capstoneProject.title,
              description: capstoneProject.description,
              isCapstoneCompleted: capstoneProject.isLocked,
            }
          : null;

      // Build the complete course data
      const courseData = {
        title: values.title.trim(),
        slug: values.title.toLowerCase().replace(/\s+/g, '-').trim(),
        description: values.description.trim(),
        stream: values.stream,
        level: values.level,
        price: parseFloat(values.price),
        discountedPrice: values.discountedPrice ? parseFloat(values.discountedPrice) : null,
        instructor: values.instructor,
        totalDuration: values.totalDuration?.trim() || '',
        tags: values.tags
          ? values.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean)
          : [],
        isPublished: isEditMode ? course?.status === 'Published' : false,
        modules: modulesData,
        capstoneProject: capstoneProjectData,
      };

      console.log('Course data to submit:', courseData);

      let response;
      if (isEditMode) {
        console.log('Making UPDATE request to course ID:', course.id);
        response = await adminService.updateCourse(course.id, courseData);
      } else {
        console.log('Making CREATE request');
        response = await adminService.createCourse(courseData);
      }

      console.log('API Response:', response);

      if (response?.success) {
        toast.success(
          isEditMode ? 'Course updated successfully!' : 'Course created successfully!',
          {
            description: isEditMode
              ? 'Your changes have been saved.'
              : 'Your course has been added to the platform.',
          },
        );
        onBack();
      } else {
        const errorMessage = response?.message || response?.error?.message || 'Operation failed';
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Please try again';
      toast.error(isEditMode ? 'Failed to update course' : 'Failed to create course', {
        description: errorMsg,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-full mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            {isEditMode ? 'Edit Course' : 'Create a New Course'}
          </h1>
          <p className="text-zinc-400">
            {isEditMode
              ? 'Update the course details below.'
              : 'Fill in the details below to add a new course to the platform.'}
          </p>
        </div>

        <form
          id="create-course-form"
          onSubmit={form.handleSubmit(onSubmit, errors => {
            console.error('Form validation errors:', errors);
            const errorMessages = Object.entries(errors)
              .map(([field, error]) => `${field}: ${error?.message}`)
              .join(', ');
            toast.error('Form Validation Error', {
              description: errorMessages || 'Please check all required fields',
            });
          })}
          className="space-y-8"
        >
          <CourseDetailsForm control={form.control} />

          {/* Modules */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Modules</h2>
            <div className="space-y-6">
              {moduleHooks.modules.map((module, moduleIndex) => (
                <CourseModuleCard
                  key={module.id}
                  module={module}
                  moduleIndex={moduleIndex}
                  canDelete={moduleHooks.modules.length > 1}
                  onDelete={() => moduleHooks.deleteModule(module.id)}
                  onUpdate={(field, value) => moduleHooks.updateModule(module.id, field, value)}
                  linkHandlers={{
                    addTextLink: () => moduleHooks.addTextLink(module.id),
                    updateTextLink: (linkIndex, value) =>
                      moduleHooks.updateTextLink(module.id, linkIndex, value),
                    removeTextLink: linkIndex => moduleHooks.removeTextLink(module.id, linkIndex),
                    addVideoLink: () => moduleHooks.addVideoLink(module.id),
                    updateVideoLink: (linkIndex, value) =>
                      moduleHooks.updateVideoLink(module.id, linkIndex, value),
                    removeVideoLink: linkIndex => moduleHooks.removeVideoLink(module.id, linkIndex),
                  }}
                  quizHandlers={{
                    addQuiz: moduleHooks.addQuiz,
                    deleteQuiz: moduleHooks.deleteQuiz,
                    updateQuiz: moduleHooks.updateQuiz,
                    addQuestion: moduleHooks.addQuestion,
                    deleteQuestion: moduleHooks.deleteQuestion,
                    updateQuestion: moduleHooks.updateQuestion,
                    addOption: moduleHooks.addOption,
                    updateOption: moduleHooks.updateOption,
                  }}
                />
              ))}

              <Button
                type="button"
                onClick={moduleHooks.addModule}
                className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>

          {/* Capstone Project */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Capstone Project</h2>
            <div className="space-y-6">
              {capstoneHooks.capstoneProjects.map((project, projectIndex) => (
                <CourseCapstoneProjectCard
                  key={project.id}
                  project={project}
                  projectIndex={projectIndex}
                  canDelete={capstoneHooks.capstoneProjects.length > 1}
                  onDelete={() => capstoneHooks.deleteCapstoneProject(project.id)}
                  onUpdate={(field, value) =>
                    capstoneHooks.updateCapstoneProject(project.id, field, value)
                  }
                  requirementHandlers={{
                    add: () => capstoneHooks.addRequirement(project.id),
                    update: (reqIndex, value) =>
                      capstoneHooks.updateRequirement(project.id, reqIndex, value),
                    remove: reqIndex => capstoneHooks.removeRequirement(project.id, reqIndex),
                  }}
                  deliverableHandlers={{
                    add: () => capstoneHooks.addDeliverable(project.id),
                    update: (delIndex, value) =>
                      capstoneHooks.updateDeliverable(project.id, delIndex, value),
                    remove: delIndex => capstoneHooks.removeDeliverable(project.id, delIndex),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              type="button"
              onClick={onBack}
              className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {isEditMode ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;

