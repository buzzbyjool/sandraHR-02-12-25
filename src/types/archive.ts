export type ArchiveStatus = 'active' | 'archived';
export type ArchiveReason = 'hired' | 'position_filled' | 'position_cancelled' | 'rejected' | 'withdrawn' | 'other';

export interface ArchiveMetadata {
  archivedAt: string;
  archivedBy: string;
  reason: ArchiveReason;
  notes?: string;
  status?: string;
  relatedIds?: {
    candidateId?: string;
    jobId?: string;
    companyId?: string;
  };
}