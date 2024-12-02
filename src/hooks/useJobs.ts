import { useFirestore } from './useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { useDataContext } from './useDataContext';
import { deleteJobAndAssociations } from '../services/jobDeletionService';
import { ActivityLogger, createActivityDescription } from '../services/activityLogger';

export interface Job {
  id?: string;
  title: string;
  company: string;
  department: string;
  companyId: string;
  teamId?: string | null;
  location: string;
  type: string;
  status: 'active' | 'archived';
  description: string;
  requirements: string[];
  createdAt: string;
  color?: string;
  theme?: {
    color: string;
    bgColor: string;
    borderColor: string;
    hoverBgColor: string;
  };
  archiveMetadata?: {
    archivedAt: string;
    archivedBy: string;
    reason: 'position_filled' | 'position_cancelled' | 'other';
    notes?: string;
  };
}

const jobThemes = [
  {
    color: '#4F46E5',
    bgColor: 'rgba(79, 70, 229, 0.04)',
    borderColor: 'rgba(79, 70, 229, 0.15)',
    hoverBgColor: 'rgba(79, 70, 229, 0.08)'
  },
  {
    color: '#0891B2',
    bgColor: 'rgba(8, 145, 178, 0.04)', 
    borderColor: 'rgba(8, 145, 178, 0.15)',
    hoverBgColor: 'rgba(8, 145, 178, 0.08)'
  },
  {
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.04)',
    borderColor: 'rgba(5, 150, 105, 0.15)', 
    hoverBgColor: 'rgba(5, 150, 105, 0.08)'
  },
  {
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.04)',
    borderColor: 'rgba(217, 119, 6, 0.15)',
    hoverBgColor: 'rgba(217, 119, 6, 0.08)'
  },
  {
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.04)',
    borderColor: 'rgba(220, 38, 38, 0.15)',
    hoverBgColor: 'rgba(220, 38, 38, 0.08)'
  }
];

export function useJobs() {
  const { getContextIds } = useDataContext();
  const { companyId, isAdmin } = getContextIds();
  const activityLogger = ActivityLogger.getInstance();

  const { documents, add: addJob, update, ...rest } = useFirestore<Job>({
    collectionName: 'jobs',
    queries: [
      ...(companyId && !isAdmin ? [where('companyId', '==', companyId)] : []),
      orderBy('createdAt', 'desc')
    ],
    enforceContext: !isAdmin
  });

  // Ensure each job has a theme
  const jobsWithThemes = documents.map((job, index) => ({
    ...job,
    theme: job.theme || jobThemes[index % jobThemes.length]
  }));

  // Wrap add to include a theme
  const add = async (data: Omit<Job, 'id' | 'theme'>) => {
    const theme = jobThemes[documents.length % jobThemes.length];
    const jobId = await addJob({ ...data, theme });

    await activityLogger.logActivity({
      userId: getContextIds().userId!,
      companyId: getContextIds().companyId!,
      type: 'job_created',
      description: createActivityDescription('job_created', {
        jobTitle: data.title
      }),
      metadata: {
        jobId,
        department: data.department
      }
    });

    return jobId;
  };

  // Enhanced remove function that cleans up all associated data
  const remove = async (jobId: string) => {
    const result = await deleteJobAndAssociations(jobId);
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete job');
    }
    return result;
  };

  return {
    documents: jobsWithThemes,
    add,
    update,
    remove,
    ...rest
  };
}