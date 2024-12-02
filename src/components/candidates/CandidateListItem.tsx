import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, MapPin, Building, Trash2, Briefcase } from 'lucide-react';
import { Candidate } from '../../types/candidate';
import { Dialog } from '@headlessui/react';
import { useJobs } from '../../hooks/useJobs';
import { useCandidateJobs } from '../../hooks/useCandidateJobs';

interface CandidateListItemProps {
  candidate: Candidate;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export default function CandidateListItem({ candidate, isSelected, onClick, onDelete }: CandidateListItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showJobDialog, setShowJobDialog] = React.useState(false);
  const { documents: jobs } = useJobs();
  const { add: addCandidateJob } = useCandidateJobs(candidate.id);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleJobClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowJobDialog(true);
  };

  const handleAssignJob = async (jobId: string) => {
    try {
      await addCandidateJob({
        candidateId: candidate.id!,
        jobId,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setShowJobDialog(false);
    } catch (error) {
      console.error('Error assigning job:', error);
    }
  };

  const confirmDelete = () => {
    if (onDelete && candidate.id) {
      onDelete(candidate.id);
    }
    setShowDeleteDialog(false);
  };
  
  return (
    <div>
      <motion.div
        whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={`p-4 cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-indigo-50/90 border-l-4 border-indigo-500 shadow-sm' 
            : 'hover:bg-gray-50/90 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none'
        }`}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
      >
        <div className="flex items-start gap-4 sm:gap-6">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#0BDFE7] to-[#373F98] rounded-full 
              flex items-center justify-center text-white text-lg font-semibold shadow-md"
            aria-hidden="true"
          >
            {candidate.name.charAt(0)}
          </div>
          
          <div className="flex-1 relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {candidate.name} {candidate.surname}
                </h3>
                <p className="text-base text-gray-700 mt-0.5">{candidate.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500" aria-label={`Rating: ${candidate.rating} out of 10`}>
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{candidate.rating}</span>
                </div>
                <button
                  onClick={handleJobClick}
                  className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"
                  aria-label="Assign to job"
                >
                  <Briefcase size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Delete candidate"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              {candidate.company && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Building size={16} />
                  <span className="truncate max-w-[200px]">{candidate.company}</span>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin size={16} />
                  <span className="truncate max-w-[200px]">{candidate.location}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-gray-100/80 text-gray-700 rounded-full transition-colors hover:bg-gray-200/80"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span
                  className="px-3 py-1 text-xs font-medium bg-indigo-50/80 text-indigo-600 rounded-full transition-colors hover:bg-indigo-100/80"
                  title={candidate.skills.slice(3).join(', ')}
                >
                  +{candidate.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Delete Candidate
            </Dialog.Title>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {candidate.name} {candidate.surname}? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      <Dialog
        open={showJobDialog}
        onClose={() => setShowJobDialog(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        >
          <Dialog.Title className="text-lg font-semibold mb-4">
            Assign to Job
          </Dialog.Title>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {jobs.map((job) => (
              <motion.button
                key={job.id}
                onClick={() => handleAssignJob(job.id!)}
                className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">{job.department}</p>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: job.color }}
                  />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowJobDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
      </Dialog>
    </div>
  );
}