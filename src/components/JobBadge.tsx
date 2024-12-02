import React from 'react';
import { useJobs } from '../hooks/useJobs';

interface JobBadgeProps {
  jobId: string | null;
  className?: string;
}

export default function JobBadge({ jobId, className = '' }: JobBadgeProps) {
  const { documents: jobs } = useJobs();
  const job = jobs.find(j => j.id === jobId) || {
    title: 'Default',
    color: '#E2E8F0'
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${className}`}
      style={{
        backgroundColor: `${job.color}20`,
        color: job.color
      }}
    >
      <span
        className="w-2 h-2 rounded-full mr-1.5"
        style={{ backgroundColor: job.color }}
      />
      {job.title}
    </div>
  );
}