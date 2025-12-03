import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/common/components/ui/field';
import { InputGroupTextarea } from '@/common/components/ui/input-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

export const CourseCapstoneProjectCard = ({
  project,
  projectIndex,
  canDelete,
  onDelete,
  onUpdate,
  requirementHandlers,
  deliverableHandlers,
}) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-zinc-100">Capstone Project</CardTitle>
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-zinc-300 font-medium">Project Title</FieldLabel>
            <Input
              value={project.title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="e.g., Build a Personal Portfolio Website"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </Field>

          <Field>
            <FieldLabel className="text-zinc-300 font-medium">Project Description</FieldLabel>
            <InputGroupTextarea
              value={project.description}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="What students will create in this project..."
              rows={4}
              className="resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};
