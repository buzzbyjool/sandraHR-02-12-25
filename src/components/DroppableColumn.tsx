import React, { memo, useCallback } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

const DroppableColumn = memo(function DroppableColumn({ id, children }: DroppableColumnProps) {
  const setRef = useCallback((el: HTMLElement | null, provided: any) => {
    if (el) {
      provided.innerRef(el);
    }
  }, []);

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <motion.div
          ref={(el) => setRef(el, provided)}
          {...provided.droppableProps}
          className="rounded-lg p-3 min-h-[200px] lg:min-h-[500px]"
          animate={{
            backgroundColor: snapshot.isDraggingOver ? 'rgba(99, 102, 241, 0.05)' : 'rgba(249, 250, 251, 0.5)',
            scale: snapshot.isDraggingOver ? 1.01 : 1,
            transition: { duration: 0.2 }
          }}
        >
          <AnimatePresence mode="popLayout">
            {children}
          </AnimatePresence>
          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
}, (prevProps, nextProps) => prevProps.id === nextProps.id);

export default DroppableColumn;