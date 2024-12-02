import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  color: string;
  borderColor: string;
}

export const DroppableContainer = React.memo(({ id, children, color, borderColor }: DroppableContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { 
    containerRef, 
    canScrollLeft, 
    canScrollRight, 
    scrollTo 
  } = useHorizontalScroll();

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        backgroundColor: isOver ? color : 'rgba(249, 250, 251, 0.9)',
        scale: isOver ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-3 min-h-[200px] lg:min-h-[500px] relative backdrop-blur-sm border
        shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)]
        hover:shadow-[0_6px_16px_-3px_rgba(0,0,0,0.06),0_3px_8px_-2px_rgba(0,0,0,0.03)]
        transition-shadow duration-200"
      style={{ borderColor: borderColor }}
    >
      <div className="relative flex items-center">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              onClick={() => scrollTo('left')}
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-full bg-white/90 shadow-md
                hover:bg-white transition-all duration-200 border border-gray-200/50
                hover:scale-105 active:scale-95 backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              onClick={() => scrollTo('right')}
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-50 p-1.5 rounded-full bg-white/90 shadow-md
                hover:bg-white transition-all duration-200 border border-gray-200/50
                hover:scale-105 active:scale-95 backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className="overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-hide relative w-full px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-col gap-2">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

DroppableContainer.displayName = 'DroppableContainer';