export type CandidateSource = 'Manual Web' | 'IA Web' | 'IA Enterprise';
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'createdAt' | 'rating';

export interface Candidate {
  id?: string;
  companyId: string;
  teamId?: string | null;
  name: string;
  surname: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  location?: string;
  address?: string;
  nationality?: string;
  residentInEU?: boolean;
  workPermitEU?: boolean;
  iaSalaryEstimation?: number;
  sandraFeedback?: string;
  status: 'active' | 'archived';
  stage: string;
  skills: string[];
  rating: number;
  notes?: string;
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
    fieldOfStudy: string;
  }>;
  source: CandidateSource;
  cvUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  archiveMetadata?: {
    archivedAt: string;
    archivedBy: string;
    reason: 'hired' | 'rejected' | 'withdrawn' | 'other';
    notes?: string;
  };
}

export interface CandidateNote {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}