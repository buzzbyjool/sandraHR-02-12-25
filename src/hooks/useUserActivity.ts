import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useDataContext } from './useDataContext';

export interface Activity {
  id: string;
  type: 'job_created' | 'candidate_created' | 'stage_changed' | 'interview_scheduled' | 'feedback_added' | 'offer_generated';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  companyId: string;
}

export function useUserActivity(limitCount: number = 10) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();

  useEffect(() => {
    if (!currentUser || !companyId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activitiesQuery = query(
      collection(db, 'activities'),
      where('userId', '==', currentUser.uid),
      where('companyId', '==', companyId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
      const newActivities: Activity[] = [];
      snapshot.forEach(doc => {
        newActivities.push({
          id: doc.id,
          ...doc.data()
        } as Activity);
      });
      setActivities(newActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, limitCount]);

  return { activities, loading };
}