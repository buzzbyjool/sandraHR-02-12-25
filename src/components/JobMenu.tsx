import React, { useState, useCallback } from 'react';
import { Plus, Briefcase, ChevronDown, UserPlus, Search, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useJobs } from '../hooks/useJobs';
import AnimatedButton from './AnimatedButton';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { useCandidateJobs, CandidateJob } from '../hooks/useCandidateJobs';
import { useCandidates } from '../hooks/useCandidates';
import DeleteJobDialog from './DeleteJobDialog';
import { toast } from 'react-hot-toast';

interface JobMenuProps {
  onSelectJob: (jobId: string | null) => void;
  selectedJobId: string | null;
}

export default function JobMenu({ onSelectJob, selectedJobId }: JobMenuProps) {
  const { t } = useTranslation();
  const { documents: jobs, remove } = useJobs();
  const { documents: candidateJobs, add: addCandidateJob } = useCandidateJobs();
  const [hasFilters, setHasFilters] = useState(false);
  const { documents: candidates } = useCandidates();
  const [addingToJobId, setAddingToJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobToDelete, setJobToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter out candidates that are already assigned to the job
  const availableCandidates = candidates.filter(candidate => {
    const isAssigned = candidateJobs.some(cj => 
      cj.jobId === addingToJobId && 
      cj.candidateId === candidate.id
    );
    return !isAssigned && (
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddCandidate = async (candidateId: string) => {
    if (!addingToJobId) return;
    
    try {
      const candidateJobData: Omit<CandidateJob, 'id'> = {
        candidateId,
        jobId: addingToJobId,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await addCandidateJob(candidateJobData);
      setAddingToJobId(null);
      toast.success(t('jobs.candidate_added'));
    } catch (error) {
      console.error('Error assigning candidate to job:', error);
      toast.error(t('jobs.candidate_add_error'));
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setIsDeleting(true);
      const result = await remove(jobToDelete.id);
      
      if (selectedJobId === jobToDelete.id) {
        onSelectJob(null);
      }

      toast.success(t('jobs.delete_success', { 
        title: jobToDelete.title,
        count: result.deletedAssociations 
      }));
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(t('jobs.delete_error'));
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
    }
  };

  // Get active candidate count for each job
  const getJobCandidateCount = (jobId: string) => {
    return candidateJobs.filter(cj => 
      cj.jobId === jobId && 
      !['rejected', 'inactive'].includes(cj.status)
    ).length;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b border-gray-200/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-none">
            <Briefcase className="text-indigo-600" size={20} />
            {t('jobs.title')}
          </h2>
          {selectedJobId && <div className="h-6 w-px bg-gray-200 mx-1" />}
          <motion.button
            initial={false}
            animate={{ opacity: selectedJobId ? 1 : 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectJob(null)}
            disabled={!selectedJobId}
            className={`group relative px-3 py-1.5 text-sm font-medium rounded-lg
              overflow-hidden transition-colors duration-200
              ${selectedJobId 
                ? 'text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'pointer-events-none'
              }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
              Clear Filter
            </span>
            <motion.div
              initial={false}
              animate={{
                opacity: selectedJobId ? [0, 0.15, 0] : 0
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-indigo-400"
            />
          </motion.button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MotionConfig transition={{ duration: 0.3 }}>
          {jobs.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <motion.div
                key={job.id} 
                animate={{ 
                  filter: selectedJobId && !isSelected ? 'blur(4px)' : 'blur(0px)',
                  scale: isSelected ? 1.02 : 1,
                  opacity: selectedJobId && !isSelected ? 0.6 : 1
                }}
                whileHover={!selectedJobId || isSelected ? { scale: 1.02 } : {}}
                className={`p-4 rounded-lg transition-all ${
                  isSelected 
                    ? 'shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1),0_4px_8px_-4px_rgba(99,102,241,0.2)] ring-2' 
                    : 'shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]'
                } ${selectedJobId && !isSelected ? 'pointer-events-none' : ''}`}
                style={{
                  backgroundColor: job.theme.bgColor,
                  borderColor: job.theme.borderColor,
                  ...(isSelected && { ringColor: job.theme.color })
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={() => onSelectJob(job.id)} 
                  >
                    <h3 className="font-semibold" style={{ color: job.theme.color }}>{job.title}</h3>
                    <p className="text-sm" style={{ color: `${job.theme.color}99` }}>
                      {job.company} • {job.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAddingToJobId(job.id!)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isSelected || !selectedJobId
                          ? `hover:text-${job.theme.color} hover:bg-white/20`
                          : 'opacity-0'
                      }`}
                      title="Add candidate"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button
                      onClick={() => setJobToDelete({ id: job.id!, title: job.title })}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isSelected || !selectedJobId
                          ? 'hover:text-red-600 hover:bg-white/20'
                          : 'opacity-0'
                      }`}
                      title="Delete job"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: job.theme.color }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm" 
                  style={{ color: `${job.theme.color}99` }}>
                  <span>{job.location}</span>
                  <span>{getJobCandidateCount(job.id!)} active candidates</span>
                </div>
              </motion.div>
            );
          })}
        </MotionConfig>
      </div>
      
      <Dialog
        open={!!addingToJobId}
        onClose={() => setAddingToJobId(null)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Add Candidate to Job
            </Dialog.Title>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableCandidates.map((candidate) => (
                <motion.button
                  key={candidate.id}
                  onClick={() => handleAddCandidate(candidate.id!)}
                  className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
              
              {availableCandidates.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No available candidates found
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAddingToJobId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>

      <DeleteJobDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteJob}
        jobTitle={jobToDelete?.title || ''}
        loading={isDeleting}
      />
    </div>
  );
}