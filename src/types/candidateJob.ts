export interface CandidateJob {
  id?: string;
  candidateId: string;
  jobId: string;
  status: 'matched' | 'in_progress' | 'rejected' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const statusColors = {
  matched: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    label: 'Matched',
    description: 'Candidate has been accepted for this position'
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    label: 'In Progress',
    description: 'Application is under review'
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    label: 'Rejected',
    description: 'Application has been declined'
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    label: 'Inactive',
    description: 'Application is no longer active'
  }
};