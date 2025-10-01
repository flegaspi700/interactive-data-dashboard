import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 📚 Widget configuration interface
export interface WidgetConfig {
  id: string;
  type: string;
  position: number;
  visible: boolean;
  props?: Record<string, any>;
}

// 📚 Dashboard layout state interface
interface DashboardState {
  widgets: WidgetConfig[];
  isEditMode: boolean;
  setEditMode: (editMode: boolean) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  updateWidgetProps: (widgetId: string, props: Record<string, any>) => void;
  resetLayout: () => void;
}

// 📚 Default widget configuration
const defaultWidgets: WidgetConfig[] = [
  {
    id: 'weather',
    type: 'weather',
    position: 0,
    visible: true,
    props: { initialCity: 'Manila' }
  },
  {
    id: 'news',
    type: 'news',
    position: 1,
    visible: true,
    props: { initialCategory: 'technology' }
  },
  {
    id: 'github',
    type: 'github',
    position: 2,
    visible: true,
    props: { initialUsername: 'flegaspi700' }
  },
  {
    id: 'crypto',
    type: 'crypto',
    position: 3,
    visible: true,
    props: { initialLimit: 6 }
  },
  {
    id: 'quotes',
    type: 'quotes',
    position: 4,
    visible: true,
    props: { initialCategory: 'motivational' }
  },
  {
    id: 'placeholder',
    type: 'placeholder',
    position: 5,
    visible: true,
    props: { title: 'More Widgets', color: 'purple' }
  }
];

// 📚 Create the dashboard store with persistence
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      isEditMode: false,

      // 📚 Toggle edit mode for drag and drop
      setEditMode: (editMode: boolean) => {
        set({ isEditMode: editMode });
      },

      // 📚 Reorder widgets when dragged and dropped
      reorderWidgets: (activeId: string, overId: string) => {
        const widgets = get().widgets;
        const activeIndex = widgets.findIndex(w => w.id === activeId);
        const overIndex = widgets.findIndex(w => w.id === overId);
        
        if (activeIndex === -1 || overIndex === -1) return;

        // Create new array with reordered widgets
        const newWidgets = [...widgets];
        const [movedWidget] = newWidgets.splice(activeIndex, 1);
        newWidgets.splice(overIndex, 0, movedWidget);
        
        // Update positions
        const updatedWidgets = newWidgets.map((widget, index) => ({
          ...widget,
          position: index
        }));

        set({ widgets: updatedWidgets });
      },

      // 📚 Toggle widget visibility
      toggleWidgetVisibility: (widgetId: string) => {
        set(state => ({
          widgets: state.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, visible: !widget.visible }
              : widget
          )
        }));
      },

      // 📚 Update widget properties
      updateWidgetProps: (widgetId: string, props: Record<string, any>) => {
        set(state => ({
          widgets: state.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, props: { ...widget.props, ...props } }
              : widget
          )
        }));
      },

      // 📚 Reset to default layout
      resetLayout: () => {
        set({ widgets: defaultWidgets, isEditMode: false });
      }
    }),
    {
      name: 'dashboard-layout', // localStorage key
      partialize: (state) => ({ 
        widgets: state.widgets 
      }), // Only persist widgets, not edit mode
    }
  )
);

// 📚 Helper function to get visible widgets sorted by position
export const useVisibleWidgets = () => {
  const widgets = useDashboardStore(state => state.widgets);
  return widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.position - b.position);
};