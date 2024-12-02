import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDataContext } from './useDataContext';

export interface DashboardMetrics {
  activeJobs: number;
  totalCandidates: number;
  stageMetrics: Record<string, number>;
  averageTimeToHire: number;
  conversionRates: {
    screening: number;
    interview: number;
    offer: number;
    hired: number;
  };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { getContextIds } = useDataContext();
  const { companyId } = getContextIds();

  useEffect(() => {
    if (!companyId) {
      setMetrics(null);
      setLoading(false);
      return;
    }

    const jobsQuery = query(
      collection(db, 'jobs'),
      where('companyId', '==', companyId),
      where('status', '==', 'Active'),
      orderBy('createdAt', 'desc')
    );

    const candidatesQuery = query(
      collection(db, 'candidates'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeJobs = onSnapshot(jobsQuery, (snapshot) => {
      const activeJobs = snapshot.size;
      
      setMetrics(prev => ({
        ...prev || {
          totalCandidates: 0,
          stageMetrics: {},
          averageTimeToHire: 0,
          conversionRates: {
            screening: 0,
            interview: 0,
            offer: 0,
            hired: 0
          }
        },
        ...prev,
        activeJobs
      }));

      setLoading(false);
    });

    const unsubscribeCandidates = onSnapshot(candidatesQuery, (snapshot) => {
      const totalCandidates = snapshot.size;
      const stageMetrics: Record<string, number> = {};
      let totalDaysToHire = 0;
      let hiredCount = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        stageMetrics[data.stage] = (stageMetrics[data.stage] || 0) + 1;

        if (data.stage === 'hired' && data.createdAt && data.hiredAt) {
          const daysToHire = Math.floor(
            (new Date(data.hiredAt).getTime() - new Date(data.createdAt).getTime()) 
            / (1000 * 60 * 60 * 24)
          );
          totalDaysToHire += daysToHire;
          hiredCount++;
        }
      });

      const averageTimeToHire = hiredCount > 0 ? Math.round(totalDaysToHire / hiredCount) : 0;

      // Calculate conversion rates
      const totalStarted = snapshot.size;
      const screeningCount = stageMetrics['screening'] || 0;
      const interviewCount = stageMetrics['interview'] || 0;
      const offerCount = stageMetrics['offer'] || 0;

      setMetrics(prev => ({
        ...prev!,
        totalCandidates,
        stageMetrics,
        averageTimeToHire,
        conversionRates: {
          screening: totalStarted > 0 ? Math.round((screeningCount / totalStarted) * 100) : 0,
          interview: screeningCount > 0 ? Math.round((interviewCount / screeningCount) * 100) : 0,
          offer: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
          hired: offerCount > 0 ? Math.round((hiredCount / offerCount) * 100) : 0
        }
      }));
      
      setLoading(false);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeCandidates();
    };
  }, [companyId]);

  return { metrics, loading };
}