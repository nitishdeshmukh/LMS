'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/common/components/ui/field';
import { InputGroupTextarea } from '@/common/components/ui/input-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

const formSchema = z.object({
  courseTitle: z.string().min(5, 'Course title must be at least 5 characters'),
  coursePrice: z.string().min(1, 'Price is required'),
  shortDescription: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be at most 500 characters'),
});

const CreateCourse = ({ onBack }) => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: '',
      timeline: '',
      topics: '',
      textLink: '',
      videoLink: '',
      quizzes: [
        {
          id: 1,
          question: '',
          options: ['', ''],
          correctAnswer: 0,
        },
      ],
    },
  ]);

  const [projectTask, setProjectTask] = useState({
    title: '',
    description: '',
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseTitle: '',
      coursePrice: '',
      shortDescription: '',
    },
  });

  const onSubmit = values => {
    console.log('Creating course:', { ...values, modules, projectTask });
    toast('Course created successfully!', {
      description: 'Your course has been added to the platform.',
      position: 'bottom-right',
    });
    onBack();
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: modules.length + 1,
        title: '',
        timeline: '',
        topics: '',
        textLink: '',
        videoLink: '',
        quizzes: [
          {
            id: 1,
            question: '',
            options: ['', ''],
            correctAnswer: 0,
          },
        ],
      },
    ]);
  };

  const deleteModule = moduleId => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId, field, value) => {
    setModules(modules.map(m => (m.id === moduleId ? { ...m, [field]: value } : m)));
  };

  const addQuiz = moduleId => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: [
                ...m.quizzes,
                {
                  id: m.quizzes.length + 1,
                  question: '',
                  options: ['', ''],
                  correctAnswer: 0,
                },
              ],
            }
          : m
      )
    );
  };

  const deleteQuiz = (moduleId, quizId) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.filter(q => q.id !== quizId),
            }
          : m
      )
    );
  };

  const updateQuiz = (moduleId, quizId, field, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q => (q.id === quizId ? { ...q, [field]: value } : q)),
            }
          : m
      )
    );
  };

  const addOption = (moduleId, quizId) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId ? { ...q, options: [...q.options, ''] } : q
              ),
            }
          : m
      )
    );
  };

  const updateOption = (moduleId, quizId, optionIndex, value) => {
    setModules(
      modules.map(m =>
        m.id === moduleId
          ? {
              ...m,
              quizzes: m.quizzes.map(q =>
                q.id === quizId
                  ? {
                      ...q,
                      options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
                    }
                  : q
              ),
            }
          : m
      )
    );
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Create a New Course</h1>
          <p className="text-zinc-400">
            Fill in the details below to add a new course to the platform.
          </p>
        </div>

        {/* Form */}
        <form id="create-course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Course Details Section */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-100">Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {/* Course Title */}
                <Controller
                  name="courseTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="course-title" className="text-zinc-300 font-medium">
                        Course Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id="course-title"
                        placeholder="e.g., Introduction to Python"
                        aria-invalid={fieldState.invalid}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Course Price */}
                <Controller
                  name="coursePrice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="max-w-xs">
                      <FieldLabel htmlFor="course-price" className="text-zinc-300 font-medium">
                        Course Price
                      </FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                          $
                        </span>
                        <Input
                          {...field}
                          id="course-price"
                          type="number"
                          step="0.01"
                          placeholder="99.99"
                          aria-invalid={fieldState.invalid}
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 pl-8"
                        />
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Short Description */}
                <Controller
                  name="shortDescription"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="short-description" className="text-zinc-300 font-medium">
                        Short Description
                      </FieldLabel>
                      <InputGroupTextarea
                        {...field}
                        id="short-description"
                        placeholder="Describe the course in a few sentences..."
                        rows={4}
                        className="resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Modules Section */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Modules</h2>
            <div className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <Card key={module.id} className="border-zinc-800 bg-zinc-900">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-zinc-100">
                      Module {moduleIndex + 1}
                    </CardTitle>
                    {modules.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteModule(module.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Module
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      {/* Module Title and Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                          <FieldLabel className="text-zinc-300 font-medium">
                            Module Title
                          </FieldLabel>
                          <Input
                            value={module.title}
                            onChange={e => updateModule(module.id, 'title', e.target.value)}
                            placeholder="e.g., Variables and Data Types"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </Field>

                        <Field>
                          <FieldLabel className="text-zinc-300 font-medium">
                            Timeline of the Module
                          </FieldLabel>
                          <Input
                            value={module.timeline}
                            onChange={e => updateModule(module.id, 'timeline', e.target.value)}
                            placeholder="e.g., Week 1 - 3 hours"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </Field>
                      </div>

                      {/* Topics Covered */}
                      <Field>
                        <FieldLabel className="text-zinc-300 font-medium">
                          Topics Covered
                        </FieldLabel>
                        <InputGroupTextarea
                          value={module.topics}
                          onChange={e => updateModule(module.id, 'topics', e.target.value)}
                          placeholder="List topics separated by commas or new lines..."
                          rows={3}
                          className="resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                        />
                      </Field>

                      {/* Content Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field>
                          <FieldLabel className="text-zinc-300 font-medium">
                            Link of Text Content
                          </FieldLabel>
                          <Input
                            value={module.textLink}
                            onChange={e => updateModule(module.id, 'textLink', e.target.value)}
                            placeholder="https://example.com/reading-material"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </Field>

                        <Field>
                          <FieldLabel className="text-zinc-300 font-medium">
                            Link of Video Content
                          </FieldLabel>
                          <Input
                            value={module.videoLink}
                            onChange={e => updateModule(module.id, 'videoLink', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                          />
                        </Field>
                      </div>

                      {/* Quizzes */}
                      <div className="bg-zinc-950 rounded-lg p-6 space-y-6 border border-zinc-800">
                        <h3 className="text-lg font-semibold text-zinc-100">Quizzes</h3>

                        {module.quizzes.map((quiz, quizIndex) => (
                          <div
                            key={quiz.id}
                            className="bg-zinc-900 rounded-lg p-4 border border-zinc-800"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-zinc-100">Quiz {quizIndex + 1}</h4>
                              {module.quizzes.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteQuiz(module.id, quiz.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-950"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>

                            <FieldGroup>
                              {/* Question */}
                              <Field>
                                <FieldLabel className="text-zinc-300 font-medium">
                                  Question
                                </FieldLabel>
                                <Input
                                  value={quiz.question}
                                  onChange={e =>
                                    updateQuiz(module.id, quiz.id, 'question', e.target.value)
                                  }
                                  placeholder="What is a variable?"
                                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                                />
                              </Field>

                              {/* Options */}
                              <div>
                                <FieldLabel className="text-zinc-300 font-medium mb-3">
                                  Options (select correct answer)
                                </FieldLabel>
                                <div className="space-y-2">
                                  {quiz.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`quiz-${module.id}-${quiz.id}`}
                                        checked={quiz.correctAnswer === optionIndex}
                                        onChange={() =>
                                          updateQuiz(
                                            module.id,
                                            quiz.id,
                                            'correctAnswer',
                                            optionIndex
                                          )
                                        }
                                        className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-blue-500 focus:ring-2"
                                      />
                                      <Input
                                        value={option}
                                        onChange={e =>
                                          updateOption(
                                            module.id,
                                            quiz.id,
                                            optionIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder={`Option ${optionIndex + 1}`}
                                        className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addOption(module.id, quiz.id)}
                                  className="mt-3 text-blue-400 hover:text-white hover:bg-blue-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>
                            </FieldGroup>
                          </div>
                        ))}

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addQuiz(module.id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add another Quiz
                        </Button>
                      </div>
                    </FieldGroup>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={addModule}
                className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>

          {/* Project Task Section */}
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-zinc-100">Project Task</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-zinc-300 font-medium">Project Title</FieldLabel>
                  <Input
                    value={projectTask.title}
                    onChange={e => setProjectTask({ ...projectTask, title: e.target.value })}
                    placeholder="e.g., Build a Personal Portfolio Website"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-300 font-medium">
                    What student has to create in this project
                  </FieldLabel>
                  <InputGroupTextarea
                    value={projectTask.description}
                    onChange={e => setProjectTask({ ...projectTask, description: e.target.value })}
                    placeholder="Provide a detailed description of the project requirements, deliverables, and evaluation criteria..."
                    rows={6}
                    className="resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button type="button" className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors">
              Save as Draft
            </Button>
            <Button
              type="submit"
              form="create-course-form"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
