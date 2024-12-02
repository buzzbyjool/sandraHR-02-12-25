import { useFirestore } from './useFirestore';
import { CandidateNote } from '../types/candidate';
import { orderBy } from 'firebase/firestore';

export function useCandidateNotes(candidateId: string) {
  const { documents: notes, add, ...rest } = useFirestore<CandidateNote>({
    collectionName: `candidates/${candidateId}/notes`,
    queries: [orderBy('createdAt', 'desc')]
  });

  return {
    notes,
    addNote: add,
    ...rest
  };
}