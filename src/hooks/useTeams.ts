import { useFirestore } from './useFirestore';
import { Team } from '../types/organization';
import { orderBy, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useTeams() {
  const { documents: teams, add, update, remove, loading, error } = useFirestore<Team>({
    collectionName: 'teams',
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  return {
    teams,
    addTeam: add,
    updateTeam: update,
    removeTeam: remove,
    loading,
    error
  };
}