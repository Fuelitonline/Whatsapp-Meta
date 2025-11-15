import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, DragIndicator } from '@mui/icons-material';
import useFlowStore from '../../app/flowStore';

const SortableScreen = ({ screen, index }) => {
  const { selectedScreenIndex, setSelectedScreenIndex, setCurrentPreviewScreen, removeScreen } = useFlowStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: screen.id,
    data: { type: 'SCREEN' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-3 mb-2 rounded-md cursor-pointer flex items-center gap-2 ${selectedScreenIndex === index ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-200'} border`}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        setSelectedScreenIndex(index);
        setCurrentPreviewScreen(index);
      }}
    >
      <div
        {...listeners}
        className="cursor-grab"
        onClick={(e) => e.stopPropagation()}
      >
        <DragIndicator className="text-gray-500" style={{ fontSize: '16px' }} />
      </div>
      <span className="flex-1 text-sm text-gray-800">
        {screen.title || `Screen ${index + 1}`}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeScreen(index);
        }}
        className="p-1 bg-transparent border-none cursor-pointer"
      >
        <Delete className="text-red-600" style={{ fontSize: '16px' }} />
      </button>
    </div>
  );
};

export default SortableScreen;