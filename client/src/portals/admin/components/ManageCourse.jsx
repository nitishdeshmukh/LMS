'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/common/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/common/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';

const formSchema = z.object({
  courseTitle: z.string().min(5, 'Course title must be at least 5 characters'),
  courseId: z.string().min(3, 'Course ID is required'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be at most 500 characters'),
  instructor: z.string().min(1, 'Please select an instructor'),
  price: z.string().min(1, 'Price is required'),
});

const ManageCourse = ({ course, onBack }) => {
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseTitle: course?.title || '',
      courseId: course?.id || '',
      category: course?.category || '',
      description: course?.description || '',
      instructor: course?.instructor || '',
      price: course?.price?.toString() || '',
    },
  });

  const onSubmit = values => {
    console.log('Updating course:', values, thumbnail);
    toast('Course updated successfully!', {
      description: (
        <pre className="bg-zinc-800 text-zinc-200 mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
    });
    onBack();
  };

  const handleThumbnailChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 ">
      <div className="max-w-full mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Manage Courses</h1>
          <p className="text-zinc-400">Add, update, and manage course details from this central dashboard.</p>
        </div>

        {/* Form */}
        <form id="manage-course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Course Title */}
            <Controller
              name="courseTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-course-title">Course Title</FieldLabel>
                  <Input
                    {...field}
                    id="edit-course-title"
                    placeholder="e.g., Introduction to Python"
                    aria-invalid={fieldState.invalid}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Course ID and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="courseId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-course-id">Course ID</FieldLabel>
                    <Input
                      {...field}
                      id="edit-course-id"
                      placeholder="e.g., PY101"
                      aria-invalid={fieldState.invalid}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      disabled
                    />
                    <FieldDescription className="text-zinc-500">Course ID cannot be changed</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-course-category">Course Category</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        id="edit-course-category"
                        aria-invalid={fieldState.invalid}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="Web Development" className="text-zinc-200 hover:bg-zinc-700">
                          Web Development
                        </SelectItem>
                        <SelectItem value="Data Science" className="text-zinc-200 hover:bg-zinc-700">
                          Data Science
                        </SelectItem>
                        <SelectItem value="Design" className="text-zinc-200 hover:bg-zinc-700">
                          Design
                        </SelectItem>
                        <SelectItem value="Backend Development" className="text-zinc-200 hover:bg-zinc-700">
                          Backend Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-course-description">Detailed Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="edit-course-description"
                      placeholder="Enter a comprehensive description of the course..."
                      rows={6}
                      className="min-h-24 resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-zinc-400 bg-zinc-800">
                        {field.value.length}/500 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription className="text-zinc-500">
                    Provide a detailed overview of what students will learn in this course.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Instructor and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="instructor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-course-instructor">Instructor</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        id="edit-course-instructor"
                        aria-invalid={fieldState.invalid}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      >
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="Dr. Ada Lovelace" className="text-zinc-200 hover:bg-zinc-700">
                          Dr. Ada Lovelace
                        </SelectItem>
                        <SelectItem value="Prof. Alan Turing" className="text-zinc-200 hover:bg-zinc-700">
                          Prof. Alan Turing
                        </SelectItem>
                        <SelectItem value="Sarah Chen" className="text-zinc-200 hover:bg-zinc-700">
                          Sarah Chen
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-course-price">Price ($)</FieldLabel>
                    <Input
                      {...field}
                      id="edit-course-price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 299.99"
                      aria-invalid={fieldState.invalid}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Course Thumbnail */}
            <div>
              <FieldLabel className="mb-3 block text-zinc-300">Course Thumbnail</FieldLabel>
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center bg-zinc-900 hover:border-zinc-600 transition-colors">
                {!thumbnail ? (
                  <label htmlFor="edit-thumbnail-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                    <p className="text-zinc-400 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-zinc-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                    <input
                      id="edit-thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img src={thumbnail} alt="Thumbnail preview" className="max-h-48 mx-auto rounded-lg" />
                    <Button
                      type="button"
                      onClick={removeThumbnail}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </FieldGroup>

          {/* Form Actions */}
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button type="submit" form="manage-course-form" className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Course
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
};

export default ManageCourse;
