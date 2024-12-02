import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import StatusBadge from './StatusBadge';
import JobStatusLegend from './JobStatusLegend';
import { Dialog } from '@headlessui/react';
import { CandidateJob, statusColors } from '../types/candidateJob';

interface CandidateJobListProps {
  candidateId: string;
}

export default function CandidateJobList({ candidateId }: CandidateJobListProps) {
  const { documents: jobs } = useJobs();
  const { documents: candidateJobs, add: addCandidateJob, update: updateCandidateJob, remove: removeCandidateJob } = useCandidateJobs(candidateId);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CandidateJob['status']>('in_progress');

  const linkedJobIds = new Set(candidateJobs.map(cj => cj.jobId));
  const availableJobs = jobs.filter(job => 
    !linkedJobIds.has(job.id!) &&
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddJob = async (jobId: string) => {
    try {
      await addCandidateJob({
        candidateId,
        jobId,
        status: selectedStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding job to candidate:', error);
    }
  };

  const handleUpdateStatus = async (candidateJobId: string, status: CandidateJob['status']) => {
    try {
      await updateCandidateJob(candidateJobId, {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating candidate job status:', error);
    }
  };

  const handleRemoveJob = async (candidateJobId: string) => {
    try {
      await removeCandidateJob(candidateJobId);
    } catch (error) {
      console.error('Error removing job from candidate:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Associated Jobs</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Job
        </button>
      </div>

      <JobStatusLegend />

      <div className="grid gap-4">
        {candidateJobs.map((candidateJob) => {
          const job = jobs.find(j => j.id === candidateJob.jobId);
          if (!job) return null;

          return (
            <motion.div
              key={candidateJob.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={candidateJob.status}
                    onChange={(e) => handleUpdateStatus(candidateJob.id!, e.target.value as CandidateJob['status'])}
                    className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {Object.keys(statusColors).map((status) => (
                      <option key={status} value={status}>
                        {statusColors[status as keyof typeof statusColors].label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveJob(candidateJob.id!)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <StatusBadge status={candidateJob.status} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog
        open={isAdding}
        onClose={() => setIsAdding(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Add Job
            </Dialog.Title>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as CandidateJob['status'])}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>
                    {statusColors[status as keyof typeof statusColors].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableJobs.map((job) => (
                <motion.button
                  key={job.id}
                  onClick={() => handleAddJob(job.id!)}
                  className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.department}</p>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAdding(false)}
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