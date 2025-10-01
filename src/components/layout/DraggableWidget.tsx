import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
}

export function DraggableWidget({ id, children }: DraggableWidgetProps) {
  const isEditMode = useDashboardStore(state => state.isEditMode);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      {/* 📚 Drag Handle - only visible in edit mode */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-blue-500 text-white 
                   rounded-full flex items-center justify-center cursor-move 
                   shadow-lg hover:bg-blue-600 transition-colors
                   opacity-0 group-hover:opacity-100"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      
      {/* 📚 Widget Content */}
      <div className={`
        ${isEditMode ? 'ring-2 ring-blue-200 ring-opacity-50 rounded-xl' : ''}
        ${isDragging ? 'scale-105' : ''}
        transition-all duration-200
      `}>
        {children}
      </div>
    </div>
  );
}