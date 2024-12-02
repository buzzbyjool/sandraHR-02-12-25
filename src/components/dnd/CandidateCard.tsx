import React from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical } from 'lucide-react';
import JobBadge from '../JobBadge';
import CandidateQuickView from '../candidates/CandidateQuickView';
import { Candidate } from '../../types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
  getCandidateJobs: (candidateId: string) => any[];
  showAllJobs: boolean;
}

export const CandidateCard = React.memo(({ 
  candidate,
  getCandidateJobs,
  showAllJobs
}: CandidateCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: candidate.id!,
  });

  const [showQuickView, setShowQuickView] = React.useState(false);

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
  };

  const jobs = getCandidateJobs(candidate.id!);
  const primaryJob = jobs[0];
  const displayedJobs = jobs.slice(0, 3);
  const remainingJobs = jobs.length - 3;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none relative w-full"
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-white rounded-lg p-4 pt-6 shadow-sm border border-gray-200/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-2 flex gap-1 px-4">
          {displayedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group/indicator cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Handle job click
              }}
            >
              <div
                className="h-2 rounded-b-full transition-all group-hover/indicator:h-3"
                style={{ 
                  backgroundColor: job.theme?.bgColor || '#E5E7EB',
                  borderColor: job.theme?.borderColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  width: index === 0 ? '2rem' : '1.5rem'
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap
                px-2 py-1 text-xs font-medium rounded-md opacity-0 translate-y-1
                group-hover/indicator:opacity-100 group-hover/indicator:translate-y-0
                transition-all duration-200 pointer-events-none z-10
                bg-white shadow-lg border border-gray-100"
                style={{
                  color: job.theme?.color,
                  borderColor: job.theme?.borderColor
                }}
              >
                {job.title}
              </div>
            </motion.div>
          ))}
          {remainingJobs > 0 && (
            <div className="h-2 px-1.5 rounded-b-full bg-gray-100 text-[10px] font-medium text-gray-500
              flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
            >
              +{remainingJobs}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div>
            <div className="font-medium text-gray-900">
              {candidate.name} {candidate.surname}
            </div>
            <div className="text-sm text-gray-500">
              {candidate.position}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {displayedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                    transition-colors duration-200"
                  style={{
                    color: job.theme?.color,
                    backgroundColor: job.theme?.bgColor,
                    borderColor: job.theme?.borderColor
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: job.theme?.color }}
                  />
                  {job.title}
                </div>
              ))}
              {remainingJobs > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickView(true);
                  }}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  +{remainingJobs} more
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickView(true);
          }}
          className="absolute top-3 right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg 
            opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
        >
          <MoreVertical size={16} />
        </button>
      </div>
      <CandidateQuickView
        candidate={candidate}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </motion.div>
  );
});

CandidateCard.displayName = 'CandidateCard';