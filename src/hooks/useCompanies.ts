import { useFirestore } from './useFirestore';
import { Company } from '../types/organization';
import { orderBy, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCompanies() {
  const { documents: companies, add, update, remove, loading, error } = useFirestore<Company>({
    collectionName: 'companies',
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  return {
    companies,
    addCompany: add,
    updateCompany: update,
    removeCompany: remove,
    loading,
    error
  };
}