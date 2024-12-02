import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  doc,
  deleteDoc
} from 'firebase/firestore';

interface DeletionResult {
  success: boolean;
  error?: string;
  deletedAssociations?: number;
}

export async function deleteJobAndAssociations(jobId: string): Promise<DeletionResult> {
  const batch = writeBatch(db);
  
  try {
    // 1. Get all candidate job associations
    const candidateJobsRef = collection(db, 'candidateJobs');
    const candidateJobsQuery = query(
      candidateJobsRef,
      where('jobId', '==', jobId)
    );
    
    const candidateJobsSnapshot = await getDocs(candidateJobsQuery);
    const associationsCount = candidateJobsSnapshot.size;

    // 2. Add all candidate job associations to batch delete
    candidateJobsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 3. Delete the main job document
    const jobRef = doc(db, 'jobs', jobId);
    batch.delete(jobRef);

    // 4. Commit all deletions in a single batch
    await batch.commit();

    console.log(`Successfully deleted job ${jobId} and ${associationsCount} associations`);
    
    return {
      success: true,
      deletedAssociations: associationsCount
    };

  } catch (error) {
    console.error('Error during job deletion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during deletion'
    };
  }
}