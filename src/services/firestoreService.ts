import { 
  collection,
  query,
  QueryConstraint,
  onSnapshot,
  DocumentData,
  FirebaseError,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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