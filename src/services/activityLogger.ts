import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ActivityLog {
  userId: string;
  type: 'job_created' | 'candidate_created' | 'stage_changed' | 'interview_scheduled' | 'feedback_added' | 'offer_generated';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  companyId: string;
}

export class ActivityLogger {
  private static instance: ActivityLogger;

  private constructor() {}

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  async logActivity(activity: ActivityLog): Promise<void> {
    try {
      if (!activity.userId || !activity.companyId) {
        throw new Error('Missing required fields: userId or companyId');
      }

      await addDoc(collection(db, 'activities'), {
        ...activity,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      throw error;
    }
  }
}

// Helper function to create activity descriptions
export function createActivityDescription(
  type: ActivityLog['type'],
  metadata: Record<string, any>
): string {
  switch (type) {
    case 'job_created':
      return `Created new job position: ${metadata.jobTitle}`;
    case 'candidate_created':
      return `Added new candidate: ${metadata.candidateName}`;
    case 'stage_changed':
      return `Moved ${metadata.candidateName} to ${metadata.newStage} stage`;
    case 'interview_scheduled':
      return `Scheduled interview with ${metadata.candidateName} for ${metadata.jobTitle}`;
    case 'feedback_added':
      return `Added feedback for ${metadata.candidateName}`;
    case 'offer_generated':
      return `Generated offer for ${metadata.candidateName}`;
    default:
      return 'Unknown activity';
  }
}