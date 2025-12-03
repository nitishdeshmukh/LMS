import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/common/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/common/components/ui/field';
import { InputGroupTextarea } from '@/common/components/ui/input-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';

export const CourseDetailsForm = ({ control }) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">Course Details</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* Course Title */}
          <Controller
            name="title"
            control={control}
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

          {/* Stream and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="stream"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="course-stream" className="text-zinc-300 font-medium">
                    Course Stream
                  </FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger
                      id="course-stream"
                      aria-invalid={fieldState.invalid}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    >
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem
                        value="Web Development"
                        className="text-zinc-200 hover:bg-zinc-700"
                      >
                        Web Development
                      </SelectItem>
                      <SelectItem value="Data Science" className="text-zinc-200 hover:bg-zinc-700">
                        Data Science
                      </SelectItem>
                      <SelectItem value="Design" className="text-zinc-200 hover:bg-zinc-700">
                        Design
                      </SelectItem>
                      <SelectItem
                        value="Backend Development"
                        className="text-zinc-200 hover:bg-zinc-700"
                      >
                        Backend Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="level"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="course-level" className="text-zinc-300 font-medium">
                    Course Level
                  </FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger
                      id="course-level"
                      aria-invalid={fieldState.invalid}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100"
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="Beginner" className="text-zinc-200 hover:bg-zinc-700">
                        Beginner
                      </SelectItem>
                      <SelectItem value="Intermediate" className="text-zinc-200 hover:bg-zinc-700">
                        Intermediate
                      </SelectItem>
                      <SelectItem value="Advanced" className="text-zinc-200 hover:bg-zinc-700">
                        Advanced
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
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="short-description" className="text-zinc-300 font-medium">
                  Course Description
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

          {/* Instructor and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="totalDuration"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="total-duration" className="text-zinc-300 font-medium">
                    Total Duration
                  </FieldLabel>
                  <Input
                    {...field}
                    id="total-duration"
                    placeholder="e.g., 8 weeks or 40 hours"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                  />
                </Field>
              )}
            />
          </div>

          {/* Price and Discounted Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
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
                      placeholder="500"
                      aria-invalid={fieldState.invalid}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 pl-8"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="discountedPrice"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="discounted-price" className="text-zinc-300 font-medium">
                    Discounted Price (Optional)
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      $
                    </span>
                    <Input
                      {...field}
                      id="discounted-price"
                      type="number"
                      step="0.01"
                      placeholder="399"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 pl-8"
                    />
                  </div>
                </Field>
              )}
            />
          </div>

          {/* Tags */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="course-tags" className="text-zinc-300 font-medium">
                  Tags (Optional)
                </FieldLabel>
                <Input
                  {...field}
                  id="course-tags"
                  placeholder="e.g., javascript, react, nodejs"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                />
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
