import { useState, useCallback, useEffect } from 'react';
import { AdminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { AdminUser, SystemConfig } from '../types/admin';

export function useAdmin() {
  const { currentUser } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adminService = AdminService.getInstance();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const status = await adminService.getAdminUser(currentUser.uid);
        setAdminUser(status);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  const updateUserRole = useCallback(async (
    targetUserId: string,
    newRole: string
  ) => {
    if (!currentUser) return false;

    setLoading(true);
    setError(null);

    try {
      const success = await adminService.updateAdminRole(
        currentUser.uid,
        targetUserId,
        newRole
      );
      return success;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    adminUser,
    loading,
    error,
    updateUserRole
  };
}