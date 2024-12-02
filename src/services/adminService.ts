import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { AdminUser, AdminRole } from '../types/admin';
import { AuditLogService } from './auditLog';

const SUPER_ADMIN_EMAIL = 'julien.doussot@mac.com';

export class AdminService {
  private static instance: AdminService;
  private auditLog: AuditLogService;

  private constructor() {
    this.auditLog = AuditLogService.getInstance();
  }

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getAdminUser(userId: string): Promise<AdminUser | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userRef = await getDoc(doc(db, 'admin_users', userId));
    
    // Check if user exists and is super admin
    if (userDoc.exists() && userDoc.data().email === SUPER_ADMIN_EMAIL) {
      // Create or update admin user record
      const adminUser: AdminUser = {
        id: userId,
        email: SUPER_ADMIN_EMAIL,
        name: userDoc.data().name || 'Super Admin',
        role: 'super_admin',
        permissions: ['*'],
        isSuperAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
      
      await setDoc(doc(db, 'admin_users', userId), adminUser);
      return adminUser;
    }
    
    // Return existing admin user if found
    if (!userRef.exists()) {
      return null;
    }
    return userRef.data() as AdminUser;
  }

  async updateAdminRole(
    currentAdminId: string,
    targetUserId: string,
    newRole: AdminRole
  ): Promise<boolean> {
    try {
      // Check if current admin has permission
      const currentAdmin = await this.getAdminUser(currentAdminId);
      if (!currentAdmin || (currentAdmin.role !== 'super_admin' && currentAdmin.role !== 'admin')) {
        throw new Error('Insufficient permissions');
      }

      // Prevent modification of super admin
      const targetUser = await this.getAdminUser(targetUserId);
      if (targetUser?.isSuperAdmin) {
        throw new Error('Cannot modify super admin account');
      }

      // Update role
      await updateDoc(doc(db, 'admin_users', targetUserId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      await this.auditLog.logAccess(
        currentAdminId,
        'update_role',
        'admin_users',
        { targetUserId, newRole },
        true
      );

      return true;
    } catch (error) {
      console.error('Error updating admin role:', error);
      await this.auditLog.logAccess(
        currentAdminId,
        'update_role',
        'admin_users',
        { targetUserId, newRole },
        false,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      return false;
    }
  }
}