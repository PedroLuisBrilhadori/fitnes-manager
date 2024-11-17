import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { BoardColumn, BoardContainer, Column } from './BoardColumn';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { type Task, TaskCard } from './TaskCard';
import { hasDraggableData } from './utils';
import { coordinateGetter } from './multipleContainersKeyboardPreset';

const defaultCols = [
  {
    id: 'a',
    title: 'A - Empurrar/Puxar',
  },
  {
    id: 'b',
    title: 'B - Levantar',
  },
  {
    id: 'c',
    title: 'C - Empurrar/Puxar',
  },
  {
    id: 'd',
    title: 'D - Levantar',
  },
  {
    id: 'cárdio',
    title: 'Cárdio',
  },
] satisfies Column[];

export type ColumnId = string;

const initialTasks: Task[] = [
  {
    id: 1,
    name: 'Mobilidade de ombro com bastão',
    serie: 2,
    repetition: 10,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 2,
    name: 'Alongamento de ombro no chão',
    serie: 2,
    repetition: 30,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 3,
    name: 'Pêndulo',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 4,
    name: 'Leg 45',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 5,
    name: 'Agachamento Livre',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 6,
    name: 'Desenvolvimento com barra nuca',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 7,
    name: 'Supino reto',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 8,
    name: 'Remada curvada',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 9,
    name: 'Rosca 21 - livre',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'a',
  },
  {
    id: 10,
    name: 'Mobilidade de ombro com bastão',
    serie: 2,
    repetition: 10,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 11,
    name: 'Alongamento de ombro na parede',
    serie: 2,
    repetition: 30,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 12,
    name: 'Manguito rotador externo',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 13,
    name: 'Mesa Flexora',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 14,
    name: 'Levantamento terra',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 15,
    name: 'Elevação frontal + lateral',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 16,
    name: 'Rosca direta',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 17,
    name: 'Rosca inversa',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 18,
    name: 'Triceps com algum puxador (V ou corda)',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'b',
  },
  {
    id: 19,
    name: 'Mobilidade de quadril - escorpião',
    serie: 2,
    repetition: 10,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 20,
    name: 'Cadeira abdutora',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 21,
    name: 'Cadeira adutora',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 22,
    name: 'Avanço',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 23,
    name: 'Hack',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 24,
    name: 'Desenvolvimento com halter',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 25,
    name: 'Banco peitoral (peck deck)',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 26,
    name: 'Banco dorsal',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 27,
    name: 'Triceps com algum puxador (V ou barra reta)',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'c',
  },
  {
    id: 28,
    name: 'Mobilidade de quadril - escorpião',
    serie: 2,
    repetition: 10,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 29,
    name: 'Manguito rotador interno',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 30,
    name: 'Posterior de ombro com halter ou corda na polia',
    serie: 2,
    repetition: 15,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 31,
    name: 'Cadeira extensora',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 32,
    name: 'Stiff',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 33,
    name: 'Elevação frontal + lateral',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 34,
    name: 'Rosca alternada com halter',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 35,
    name: 'Triceps francês',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 36,
    name: 'Triceps com algum puxador (corda ou barra reta)',
    serie: 0,
    repetition: 0,
    checked: false,
    counter: 0,
    groupId: 'd',
  },
  {
    id: 37,
    name: 'Extensão lombar',
    serie: 4,
    repetition: 10,
    checked: false,
    counter: 0,
    groupId: 'cárdio',
  },
  {
    id: 38,
    name: 'Abdominal prancha lateral',
    serie: 4,
    repetition: 30,
    checked: false,
    counter: 0,
    groupId: 'cárdio',
  },
  {
    id: 39,
    name: 'Abdominal prancha',
    serie: 4,
    repetition: 30,
    checked: false,
    counter: 0,
    groupId: 'cárdio',
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    }),
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.groupId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task.groupId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current,
        );
        return `Picked up Task ${
          active.data.current.task.id
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.groupId,
        );
        if (over.data.current.task.groupId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.id
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.groupId,
        );
        if (over.data.current.task.groupId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  const updateTask = (cb: () => Task) => {
    const updateTask = cb();

    const updateTasks = tasks.map((t) => {
      if (t.id != updateTask.id) return t;
      return updateTask;
      1;
    });

    setTasks(updateTasks);
  };

  console.log(tasks);

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          <div className="flex flex-col gap-4">
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                updateTasks={updateTask}
                tasks={tasks.filter((task) => task.groupId === col.id)}
              />
            ))}
          </div>
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                updateTasks={updateTask}
                column={activeColumn}
                tasks={tasks.filter((task) => task.groupId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard updateTasks={updateTask} task={activeTask} isOverlay />
            )}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.name === activeId);
        const overIndex = tasks.findIndex((t) => t.name === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (activeTask && overTask && activeTask.groupId !== overTask.groupId) {
          activeTask.groupId = overTask.groupId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.name === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.groupId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}
