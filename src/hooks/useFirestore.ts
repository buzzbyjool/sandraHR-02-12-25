import { 
  collection,
  query,
  QueryConstraint,
  onSnapshot,
  DocumentData,
  FirebaseError,
  where,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { useDataContext } from './useDataContext';

interface SubscriptionConfig {
  collectionName: string;
  queries: QueryConstraint[];
  onData: (data: DocumentData[]) => void;
  onError: (error: string) => void;
}

export function createFirestoreSubscription({
  collectionName,
  queries,
  onData,
  onError
}: SubscriptionConfig) {
  try {
    const baseQuery = collection(db, collectionName);
    const q = queries.length > 0 ? query(baseQuery, ...queries) : query(baseQuery);

    return onSnapshot(
      q,
      (snapshot) => {
        const results: DocumentData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            results.push({ id: doc.id, ...data });
          }
        });
        onData(results);
      },
      (error: FirebaseError) => {
        let errorMessage = 'Error loading data. Please try again.';
        
        switch (error.code) {
          case 'permission-denied':
            errorMessage = 'Access denied. Please check your permissions.';
            break;
          case 'failed-precondition':
            errorMessage = 'Please ensure you have selected a company';
            break;
          case 'invalid-argument':
            errorMessage = 'Invalid query configuration';
            break;
        }
        
        onError(errorMessage);
      }
    );
  } catch (error) {
    onError('Failed to connect to database');
    return () => {}; // Return empty cleanup function
  }
}

interface UseFirestoreOptions {
  collectionName: string;
  queries?: QueryConstraint[];
  defaultValue?: any[];
  enforceContext?: boolean;
}

export function useFirestore<T extends DocumentData>({ 
  collectionName, 
  queries = [], 
  defaultValue = [],
  enforceContext = true
}: UseFirestoreOptions) {
  const [documents, setDocuments] = useState<T[]>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enrichData, validateAccess, getContextIds } = useDataContext();

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: (() => void) | undefined;
    const contextIds = getContextIds();

    const setupSubscription = async () => {
      setLoading(true);
      setError(null);

      // Validate collection access
      const adminCollections = ['companies', 'teams', 'users', 'admin_users'];
      const isAdminCollection = adminCollections.includes(collectionName);
      const requiresCompanyContext = enforceContext && !isAdminCollection && !contextIds.isAdmin;

      // Early return if company context is required but missing
      if (requiresCompanyContext && !contextIds.companyId) {
        setDocuments([]);
        setError('Please ensure you have selected a company');
        setLoading(false);
        return;
      }

      // Build final queries array
      const finalQueries = [...queries];
      if (requiresCompanyContext && contextIds.companyId) {
        finalQueries.unshift(where('companyId', '==', contextIds.companyId));
      }

      // Create subscription
      unsubscribe = createFirestoreSubscription({
        collectionName,
        queries: finalQueries,
        onData: (data) => {
          if (!isSubscribed) return;
          setDocuments(data as T[]);
          setLoading(false);
          setError(null);
        },
        onError: (errorMessage) => {
          if (!isSubscribed) return;
          setError(errorMessage);
          setDocuments([]);
          setLoading(false);
        }
      });
    };

    setupSubscription();

    return () => {
      isSubscribed = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(queries), enforceContext, getContextIds]);

  const add = async (data: Omit<T, 'id'>) => {
    try {
      const enrichedData = enforceContext ? enrichData(data) : data;
      const contextIds = getContextIds();
      const adminCollections = ['companies', 'teams', 'users', 'admin_users'];
      const isAdminCollection = adminCollections.includes(collectionName);
      
      if (enforceContext && !isAdminCollection && !contextIds.companyId) {
        throw new Error('Please select a company before adding data');
      }

      if (!isAdminCollection && contextIds.companyId) {
        enrichedData.companyId = contextIds.companyId;
      }
      
      if (!enrichedData.status && !isAdminCollection) {
        enrichedData.status = 'active';
      }

      const docRef = await addDoc(collection(db, collectionName), enrichedData);
      return docRef.id;
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Error adding document:', error);
      throw new Error(error.message || 'Failed to add document');
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    try {
      if (enforceContext) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          validateAccess(docSnap.data());
        }
      }

      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      } as DocumentData);
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Error updating document:', error);
      throw new Error(error.message);
    }
  };

  const remove = async (id: string) => {
    try {
      if (enforceContext) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          validateAccess(docSnap.data());
        }
      }

      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Error deleting document:', error);
      throw new Error(error.message);
    }
  };

  return {
    documents,
    loading,
    error,
    add,
    update,
    remove,
  };
}