import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  context: Record<string, any>;
  success: boolean;
  timestamp?: any;
  metadata?: Record<string, any>;
}

export class AuditLogService {
  private static instance: AuditLogService;

  private constructor() {}

  static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  async logAccess(entry: AuditLogEntry): Promise<void> {
    try {
      const auditEntry = {
        ...entry,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'audit_logs'), auditEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to prevent disrupting main operation
    }
  }
}