import { useAuth } from '../contexts/AuthContext';
import { useDataVisibility } from './useDataVisibility';
import { useCallback } from 'react';

export function useDataContext() {
  const { currentUser, userData } = useAuth();
  const { getUserCompanyId, getUserTeamIds, filterVisibleUsers } = useDataVisibility();

  const getContextIds = useCallback(() => {
    // Find admin role first, then fall back to first valid company role
    const adminRole = userData?.roles?.find(role => role.role === 'admin');
    const companyRole = userData?.roles?.find(role => role.companyId);
    const companyId = companyRole?.companyId || null;
    const teamIds = userData?.roles
      ?.filter(role => role.teamId)
      .map(role => role.teamId!) || [];
    
    return {
      companyId,
      teamIds,
      userId: currentUser?.uid || null,
      isAdmin: !!adminRole,
      role: companyRole?.role || null
    };
  }, [currentUser?.uid, userData?.roles]);

  const enrichData = useCallback(<T extends Record<string, any>>(data: T) => {
    const { companyId, teamIds, userId } = getContextIds();
    
    return {
      ...data,
      companyId,
      teamId: teamIds[0] || null,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [getContextIds]);

  const validateAccess = useCallback((data: any) => {
    const { companyId, teamIds } = getContextIds();
    
    // Allow access if no company context is required
    if (!data.companyId) {
      return true;
    }

    // Verify company access
    if (companyId && data.companyId && data.companyId !== companyId) {
      throw new Error('Invalid company access');
    }

    // Verify team access if specified
    if (data.teamId && teamIds.length > 0 && !teamIds.includes(data.teamId)) {
      throw new Error('Invalid team access');
    }

    return true;
  }, [getContextIds]);

  return {
    enrichData,
    validateAccess,
    getContextIds
  };
}