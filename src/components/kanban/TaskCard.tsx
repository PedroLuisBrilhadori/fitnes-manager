import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { GripVertical, Minus, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ColumnId } from './kanban';

export interface Task {
  id: number;
  name: string;
  serie: number;
  repetition: number;
  checked: boolean;
  counter: number;
  groupId: ColumnId;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  updateTasks: (cb: () => Task) => void;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, updateTasks }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Badge variant={'outline'} className="ml-auto font-semibold">
          {task.name}
        </Badge>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full text-green-400 border-green-400"
            onClick={() =>
              updateTasks(() => {
                task.counter += 1;

                if (task.counter == task.serie) {
                  task.checked = true;
                }

                return task;
              })
            }
          >
            <Plus />
          </Button>

          <Button
            variant="outline"
            className="rounded-full text-red-400 border-red-400"
            disabled={task.counter == 0}
            onClick={() =>
              updateTasks(() => {
                if (task.counter == task.serie) {
                  task.checked = false;
                }

                task.counter -= 1;
                return task;
              })
            }
          >
            <Minus />
          </Button>
        </div>

        <div>{task.counter}</div>

        <div>
          {task.serie} X {task.repetition}
        </div>
      </CardContent>
    </Card>
  );
}
