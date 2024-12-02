import { useState } from 'react';
import { UserModificationService } from '../services/userModificationService';
import { useAuth } from '../contexts/AuthContext';

export function useUserModification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const userModificationService = UserModificationService.getInstance();

  const modifyUser = async (data: any) => {
    if (!currentUser) {
      setError('Not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await userModificationService.modifyUser(
        currentUser.uid,
        data
      );

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    modifyUser,
    loading,
    error
  };
}