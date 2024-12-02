import { useState } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useCandidates } from './useCandidates';
import { ActivityLogger, createActivityDescription } from '../services/activityLogger';
import { useDataContext } from './useDataContext';

export function useDragAndDrop() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { documents: candidates, update } = useCandidates();
  const { getContextIds } = useDataContext();
  const activityLogger = ActivityLogger.getInstance();
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Set a timeout to clear dragging state if drag operation takes too long
    const timeout = setTimeout(() => {
      setActiveId(null);
    }, 5000);
    
    setDragTimeout(timeout);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear any existing timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }

    setActiveId(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as string;
    const candidate = candidates.find(c => c.id === candidateId);

    try {
      if (!candidate) return;

      await update(candidateId, {
        stage: newStage,
        updatedAt: new Date().toISOString()
      });

      await activityLogger.logActivity({
        userId: getContextIds().userId!,
        companyId: getContextIds().companyId!,
        type: 'stage_changed',
        description: createActivityDescription('stage_changed', {
          candidateName: `${candidate.name} ${candidate.surname}`,
          newStage
        }),
        metadata: {
          candidateId,
          oldStage: candidate.stage,
          newStage
        }
      });
    } catch (error) {
      console.error('Error updating candidate stage:', error);
    }
  };

  const handleDragCancel = () => {
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }
    setActiveId(null);
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel
  };
}