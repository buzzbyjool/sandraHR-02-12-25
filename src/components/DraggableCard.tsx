import React, { memo, useMemo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import JobBadge from './JobBadge';
import { Candidate } from '../types/candidate';

interface DraggableCardProps {
  candidate: Candidate;
  index: number;
  getCandidateJobs: (candidateId: string) => any[];
  showAllJobs: boolean;
}

const DraggableCard = forwardRef<HTMLDivElement, DraggableCardProps>(({ 
  candidate, 
  index, 
  getCandidateJobs, 
  showAllJobs 
}, ref) => {
  // Memoize jobs to prevent unnecessary recalculations
  const jobs = useMemo(() => getCandidateJobs(candidate.id!), [candidate.id, getCandidateJobs]);

  return (
    <Draggable draggableId={candidate.id!} index={index}>
      {(provided, snapshot) => {
        const style = {
          ...provided.draggableProps.style,
          transform: snapshot.isDragging 
            ? provided.draggableProps.style?.transform 
            : 'none'
        };

        return (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing ${
              snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500/20' : 'shadow'
            }`}
            style={style}
            animate={{
              scale: snapshot.isDragging ? 1.02 : 1,
              rotate: snapshot.isDragging ? 1 : 0,
              opacity: snapshot.isDragging ? 0.9 : 1
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
          >
            <div className="space-y-2">
              <div>
                <div className="font-medium text-gray-900">
                  {candidate.name}
                </div>
                <div className="text-sm text-gray-500">
                  {candidate.position}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {showAllJobs ? (
                  jobs.map(job => (
                    job && <JobBadge key={job.id} jobId={job.id} />
                  ))
                ) : (
                  jobs[0] && <JobBadge jobId={jobs[0]!.id!} />
                )}
              </div>
            </div>
          </motion.div>
        );
      }}
    </Draggable>
  );
});

DraggableCard.displayName = 'DraggableCard';

export default memo(DraggableCard, (prevProps, nextProps) => {
  // Custom comparison function for memo
  if (prevProps.candidate.id !== nextProps.candidate.id) return false;
  if (prevProps.index !== nextProps.index) return false;
  if (prevProps.showAllJobs !== nextProps.showAllJobs) return false;
  return true;
});