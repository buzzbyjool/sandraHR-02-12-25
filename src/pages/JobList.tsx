import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import { useTranslation } from 'react-i18next';
import { CandidateJob, statusColors } from '../types/candidateJob';
import AnimatedButton from '../components/AnimatedButton';
import AddJobModal from '../components/AddJobModal';
import JobSearchFilters from '../components/jobs/JobSearchFilters';

export default function JobList() {
  const { t } = useTranslation();
  const { documents: jobs } = useJobs();
  const { documents: candidateJobs } = useCandidateJobs();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get candidate count for each job
  const getJobCandidateCount = (jobId: string) => {
    return candidateJobs.filter(cj => 
      cj.jobId === jobId && 
      cj.status !== 'rejected' && 
      cj.status !== 'inactive'
    ).length;
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('jobs.title')}</h1>
        <AnimatedButton
          onClick={() => setIsCreating(true)}
          label={t('jobs.add')}
        />
      </div>

      <JobSearchFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 rounded-lg transition-all shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] 
                hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]"
              style={{
                backgroundColor: job.theme.bgColor,
                borderColor: job.theme.borderColor
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold" style={{ color: job.theme.color }}>
                    {job.title}
                  </h3>
                  <p className="text-sm" style={{ color: `${job.theme.color}99` }}>
                    {job.company} • {job.department}
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: job.theme.color }}
                />
              </div>
              <div className="flex items-center justify-between text-sm"
                style={{ color: `${job.theme.color}99` }}>
                <span>{job.location}</span>
                <span>{getJobCandidateCount(job.id!)} active candidates</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <AddJobModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  );
}