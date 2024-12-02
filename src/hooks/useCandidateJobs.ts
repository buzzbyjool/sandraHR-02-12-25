import { useFirestore } from './useFirestore';
import { CandidateJob } from '../types/candidateJob';
import { orderBy, where, QueryConstraint, query, collection, getDocs, and } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDataContext } from './useDataContext';

export function useCandidateJobs(candidateId?: string, jobId?: string) {
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();
  const queries: QueryConstraint[] = [];
  const contextIds = getContextIds();
  
  // Build query constraints in correct order
  if (contextIds.companyId) {
    queries.push(where('companyId', '==', contextIds.companyId));
  }

  if (candidateId) {
    queries.push(where('candidateId', '==', candidateId));
  }
  
  if (jobId) {
    queries.push(where('jobId', '==', jobId));
  }

  queries.push(orderBy('updatedAt', 'desc'));

  const result = useFirestore<CandidateJob>({
    collectionName: 'candidateJobs',
    queries,
    enforceContext: true,
    defaultValue: [],
  });

  return {
    ...result,
    add: async (data: Omit<CandidateJob, 'id'>) => {
      // Validate company context
      if (!companyId) {
        throw new Error('Company context required');
      }

      // Check for existing relationship
      const existingQuery = query(
        collection(db, 'candidateJobs'),
        where('candidateId', '==', data.candidateId),
        where('jobId', '==', data.jobId)
      );
      
      const existingDocs = await getDocs(existingQuery);
      if (!existingDocs.empty) {
        throw new Error('Relationship already exists');
      }
      
      // Add company context to data
      const enrichedData = {
        ...data,
        companyId,
        status: data.status || 'in_progress'
      };
      return result.add(enrichedData);
    }
  };
}