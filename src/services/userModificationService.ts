import { db } from '../lib/firebase';
import { 
  doc, 
  updateDoc,
  serverTimestamp,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { z } from 'zod';
import { AuditLogService } from './auditLog';

// Validation schemas
const roleSchema = z.enum(['member', 'lead', 'manager', 'admin']);

export interface UserModificationData {
  userId: string;
  role: z.infer<typeof roleSchema>;
  companyId: string;
  teamIds: string[];
}

interface ModificationResult {
  success: boolean;
  error?: string;
}

export class UserModificationService {
  private static instance: UserModificationService;
  private auditLog: AuditLogService;

  private constructor() {
    this.auditLog = AuditLogService.getInstance();
  }

  static getInstance(): UserModificationService {
    if (!UserModificationService.instance) {
      UserModificationService.instance = new UserModificationService();
    }
    return UserModificationService.instance;
  }

  async modifyUser(
    currentAdminId: string,
    data: UserModificationData
  ): Promise<ModificationResult> {
    try {
      // Validate input data
      roleSchema.parse(data.role);

      // Run modifications in a transaction
      await runTransaction(db, async (transaction) => {
        // Get user document reference
        const userRef = doc(db, 'users', data.userId);

        // Create roles array with company and team assignments
        const roles = [{
          companyId: data.companyId,
          role: data.role,
          updatedAt: Timestamp.now()
        }];

        // Add team assignments if present
        if (data.teamIds.length > 0) {
          data.teamIds.forEach(teamId => {
            roles.push({
              companyId: data.companyId,
              teamId,
              role: 'member',
              updatedAt: Timestamp.now()
            });
          });
        }

        // Update user document
        transaction.update(userRef, {
          roles,
          updatedAt: Timestamp.now()
        });
      });

      // Log successful modification
      await this.auditLog.logAccess({
        userId: currentAdminId,
        action: 'modify_user',
        resource: 'users',
        context: {
          targetUserId: data.userId,
          changes: {
            role: data.role,
            companyId: data.companyId,
            teamIds: data.teamIds
          }
        },
        success: true
      });

      return { success: true };
    } catch (error) {
      console.error('Error modifying user:', error);
      
      // Log failed attempt
      await this.auditLog.logAccess({
        userId: currentAdminId,
        action: 'modify_user',
        resource: 'users',
        context: {
          targetUserId: data.userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        success: false
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to modify user'
      };
    }
  }
}