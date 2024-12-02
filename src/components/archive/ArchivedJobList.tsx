import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin, Users, Clock, TrendingUp } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useCandidateJobs } from '../../hooks/useCandidateJobs';
import { formatDistanceToNow } from 'date-fns';

interface ArchivedJobListProps {
  itemsPerPage: number;
  viewMode: 'list' | 'grid';
}

export default function ArchivedJobList({ itemsPerPage, viewMode }: ArchivedJobListProps) {
  const { documents: jobs } = useJobs();
  const { documents: candidateJobs } = useCandidateJobs();
  const [currentPage, setCurrentPage] = useState(1);

  const archivedJobs = jobs.filter(job => job.status === 'archived');
  const paginatedJobs = archivedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getJobMetrics = (jobId: string) => {
    const jobCandidates = candidateJobs.filter(cj => cj.jobId === jobId);
    return {
      totalApplications: jobCandidates.length,
      timeToFill: jobCandidates.length > 0 
        ? formatDistanceToNow(new Date(jobCandidates[0].createdAt))
        : 'N/A'
    };
  };

  return (
    <div className="divide-y divide-gray-200">
      {paginatedJobs.map(job => {
        const metrics = getJobMetrics(job.id!);
        const archiveDate = job.archiveMetadata?.archivedAt 
          ? formatDistanceToNow(new Date(job.archiveMetadata.archivedAt))
          : 'Unknown';

        return (
          <motion.div
            key={job.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <Link 
                  to={`/jobs/${job.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                >
                  {job.title}
                </Link>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building2 size={16} />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Archived {archiveDate} ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div className="text-gray-500">Applications</div>
                  <div className="font-medium text-gray-900">{metrics.totalApplications}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500">Time to Fill</div>
                  <div className="font-medium text-gray-900">{metrics.timeToFill}</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}