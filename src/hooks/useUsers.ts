import { useFirestore } from './useFirestore';
import { OrganizationUser } from '../types/organization';
import { orderBy, collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useUsers() {
  const { documents: users, add, update, remove, loading, error } = useFirestore<OrganizationUser>({
    collectionName: 'users',
    queries: [orderBy('createdAt', 'desc')],
    enforceContext: false,
    defaultValue: []
  });

  return {
    users,
    addUser: add,
    updateUser: update,
    removeUser: remove,
    loading,
    error
  };
}