import { useFirestore } from './useFirestore';
import { useDataContext } from './useDataContext';
import { Candidate, CandidateSource } from '../types/candidate';
import { ActivityLogger, createActivityDescription } from '../services/activityLogger';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

const DEFAULT_STAGE = 'new';
const DEFAULT_STATUS = 'active';

export function useCandidates() {
  const { getContextIds } = useDataContext();
  const activityLogger = ActivityLogger.getInstance();
  const contextIds = getContextIds();
  const { isAdmin } = contextIds;

  // Build query constraints based on context
  const queryConstraints: QueryConstraint[] = [];
  
  // Add company filter first if needed
  if (!isAdmin && contextIds.companyId) {
    queryConstraints.push(where('companyId', '==', contextIds.companyId));
  }

  const { documents, add: baseAdd, update, remove } = useFirestore<Candidate>({
    collectionName: 'candidates',
    queries: queryConstraints,
    enforceContext: !isAdmin,
    defaultValue: []
  });

  const add = async (data: Omit<Candidate, 'id' | 'source' | 'companyId'> & { source?: CandidateSource }): Promise<string> => {
    const { companyId, teamIds } = getContextIds();
    
    if (!companyId) {
      throw new Error('Company context required to create candidate');
    }

    const candidateId = await baseAdd({
      ...data,
      companyId,
      teamId: teamIds[0] || null,
      source: data.source || 'Manual Web',
      status: DEFAULT_STATUS,
      stage: DEFAULT_STAGE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await activityLogger.logActivity({
      userId: getContextIds().userId!,
      companyId,
      type: 'candidate_created',
      description: createActivityDescription('candidate_created', {
        candidateName: `${data.name} ${data.surname}`
      }),
      metadata: {
        candidateId,
        position: data.position
      }
    });

    return candidateId;
  };

  return {
    documents,
    add,
    update,
    remove
  };
}