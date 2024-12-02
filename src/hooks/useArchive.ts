import { useState } from 'react';
import { doc, updateDoc, writeBatch, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDataContext } from './useDataContext';
import { ArchiveReason, ArchiveMetadata } from '../types/archive';
import { ActivityLogger, createActivityDescription } from '../services/activityLogger';

export function useArchive() {
  const [loading, setLoading] = useState(false);
  const { getContextIds } = useDataContext();
  const activityLogger = ActivityLogger.getInstance();

  const updateArchiveStatus = async (
    id: string,
    type: 'job' | 'candidate',
    status: 'active' | 'archived'
  ) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) return;

    setLoading(true);

    try {
      const docRef = doc(db, type === 'job' ? 'jobs' : 'candidates', id);
      await updateDoc(docRef, {
        status,
        active: status === 'active',
        'archiveMetadata.status': status,
        updatedAt: new Date().toISOString()
      });

      // Log activity
      await activityLogger.logActivity({
        userId,
        companyId,
        type: `${type}_status_updated`,
        description: createActivityDescription(`${type}_status_updated`, {
          id,
          status
        }),
        metadata: { 
          id,
          status,
          previousStatus: status === 'active' ? 'archived' : 'active'
        }
      });

    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const archiveJob = async (
    jobId: string, 
    reason: ArchiveReason,
    notes?: string
  ) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) return;

    setLoading(true);
    const batch = writeBatch(db);

    try {
      // Get all related candidate jobs
      const candidateJobsRef = collection(db, 'candidateJobs');
      const candidateJobsQuery = query(
        candidateJobsRef,
        where('jobId', '==', jobId),
        where('companyId', '==', companyId)
      );
      
      const candidateJobsSnapshot = await getDocs(candidateJobsQuery);

      const archiveMetadata: ArchiveMetadata = {
        archivedAt: new Date().toISOString(),
        archivedBy: userId,
        reason,
        notes,
      };

      // Archive job
      const jobRef = doc(db, 'jobs', jobId);
      batch.update(jobRef, {
        status: 'archived',
        active: false,
        archiveMetadata,
        updatedAt: new Date().toISOString()
      });

      // Update all related candidate jobs
      candidateJobsSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'inactive',
          updatedAt: new Date().toISOString()
        });
      });

      // Log activity
      await activityLogger.logActivity({
        userId,
        companyId,
        type: 'job_archived',
        description: createActivityDescription('job_archived', {
          reason,
          jobId
        }),
        metadata: { 
          jobId, 
          reason,
          notes,
          status: 'archived',
          affectedCandidateJobs: candidateJobsSnapshot.size
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error archiving job:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const archiveCandidate = async (
    candidateId: string,
    reason: ArchiveReason,
    notes?: string
  ) => {
    const { userId, companyId } = getContextIds();
    if (!userId || !companyId) return;

    setLoading(true);
    const batch = writeBatch(db);

    try {
      // Get all related candidate jobs
      const candidateJobsRef = collection(db, 'candidateJobs');
      const candidateJobsQuery = query(
        candidateJobsRef,
        where('candidateId', '==', candidateId),
        where('companyId', '==', companyId)
      );
      
      const candidateJobsSnapshot = await getDocs(candidateJobsQuery);

      const archiveMetadata: ArchiveMetadata = {
        archivedAt: new Date().toISOString(),
        archivedBy: userId,
        reason,
        notes
      };

      // Archive candidate
      const candidateRef = doc(db, 'candidates', candidateId);
      batch.update(candidateRef, {
        status: 'archived',
        active: false,
        archiveMetadata,
        updatedAt: new Date().toISOString()
      });

      // Update all related candidate jobs
      candidateJobsSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'inactive',
          updatedAt: new Date().toISOString()
        });
      });

      await batch.commit();

      // Log activity
      await activityLogger.logActivity({
        userId,
        companyId,
        type: 'candidate_archived',
        description: createActivityDescription('candidate_archived', {
          reason,
          candidateId
        }),
        metadata: { 
          candidateId, 
          reason,
          notes,
          status: 'archived',
          affectedJobs: candidateJobsSnapshot.size
        }
      });

    } catch (error) {
      console.error('Error archiving candidate:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    archiveJob,
    archiveCandidate,
    updateArchiveStatus,
    loading
  };
}