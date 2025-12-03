import * as z from 'zod';

export const courseFormSchema = z.object({
  title: z.string().min(5, 'Course title must be at least 5 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be at most 500 characters'),
  stream: z.string().min(1, 'Please select a stream'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.string().min(1, 'Price is required'),
  discountedPrice: z.string().optional(),
  totalDuration: z.string().optional(),
  tags: z.string().optional(),
});

export const moduleSchema = z.object({
  title: z.string().min(3, 'Module title required'),
  maxTimelineInDays: z.number().min(1, 'Timeline must be at least 1 day'),
  description: z.string().min(10, 'Module description required'),
  textLinks: z.array(z.string()).optional(),
  videoLinks: z.array(z.string()).optional(),
  quizzes: z
    .array(
      z.object({
        title: z.string().min(3, 'Quiz title required'),
        questions: z
          .array(
            z.object({
              questionText: z.string().min(5, 'Question text required'),
              options: z.array(z.string()).min(2, 'At least 2 options required'),
              correctAnswer: z.number().min(0, 'Select correct answer'),
            }),
          )
          .min(1, 'At least 1 question required'),
        status: z.literal('Locked'),
      }),
    )
    .optional(),
  tasks: z
    .array(
      z.object({
        title: z.string().min(3, 'Task title required'),
        description: z.string().min(10, 'Task description required'),
        status: z.literal('Locked'),
      }),
    )
    .optional(),
  order: z.number().min(1),
  status: z.literal('Locked'),
});

export const courseDataSchema = z.object({
  title: z.string().min(5),
  slug: z.string(),
  description: z.string().min(20).max(500),
  stream: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.number().positive(),
  discountedPrice: z.number().nullable().optional(),
  instructor: z.string().min(1),
  totalDuration: z.string().optional(),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  modules: z.array(moduleSchema),
  capstoneProject: z
    .object({
      title: z.string().min(5),
      description: z.string().min(20),
      isCapstoneCompleted: z.boolean(),
    })
    .nullable()
    .optional(),
});

export const capstoneProjectSchema = z.object({
  title: z.string().min(5, 'Project title required'),
  description: z.string().min(20, 'Project description required'),
  isCapstoneCompleted: z.boolean(),
});
