import type { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useDashboardStore } from '../../store/dashboardStore';

interface DashboardGridProps {
  children: ReactNode;
  onReorder?: (newOrder: string[]) => void;
}

export function DashboardGrid({ children, onReorder }: DashboardGridProps) {
  const { isEditMode } = useDashboardStore();
  
  // 📚 Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 📚 Handle drag end event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      // Get current order from children
      const childrenArray = Array.isArray(children) ? children : [children];
      const currentOrder = childrenArray.map((child: any) => child.props.id).filter(Boolean);
      
      // Find the indices
      const activeIndex = currentOrder.indexOf(active.id);
      const overIndex = currentOrder.indexOf(over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create new order
        const newOrder = [...currentOrder];
        const [movedItem] = newOrder.splice(activeIndex, 1);
        newOrder.splice(overIndex, 0, movedItem);
        
        // Call the callback to update parent state
        onReorder(newOrder);
      }
    }
  }

  // 📚 Extract widget IDs from children for sortable context
  const childrenArray = Array.isArray(children) ? children : [children];
  const sortableIds = childrenArray.map((child: any) => child.props.id).filter(Boolean);

  return (
    <main className="w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sortableIds}
          strategy={rectSortingStrategy}
        >
          {/* 📚 Full-screen responsive grid */}
          <div className={`
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 
            gap-4 p-4 min-h-screen
            ${isEditMode ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
            transition-colors duration-200
          `}>
            {children}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  );
}