import { useAuth } from '../contexts/AuthContext';
import { Company, Team, OrganizationUser } from '../types/organization';

export function useDataVisibility() {
  const { currentUser, userData } = useAuth();

  const getUserCompanyId = () => {
    if (!userData?.company?.companyId) {
      throw new Error('No company context available');
    }
    return userData.company.companyId;
  };

  const getUserTeamIds = () => {
    const teamIds = userData?.roles
      ?.filter(role => role.teamId)
      .map(role => role.teamId) || [];
    return teamIds;
  };

  const filterVisibleCompanies = (companyList: Company[]) => {
    const userCompanyId = getUserCompanyId();
    if (!userCompanyId) return [];
    
    const isAdmin = userData?.company?.role === 'admin';

    if (isAdmin) return companyList;
    return companyList.filter(company => company.id === userCompanyId);
  };

  const filterVisibleTeams = (teamList: Team[]) => {
    const userCompanyId = getUserCompanyId();
    const userTeamIds = getUserTeamIds();
    if (!userCompanyId) return [];

    const isAdmin = userData?.company?.role === 'admin';

    if (isAdmin) {
      return teamList.filter(team => team.companyId === userCompanyId);
    }

    return teamList.filter(team => 
      team.companyId === userCompanyId && userTeamIds.includes(team.id)
    );
  };

  const filterVisibleUsers = (userList: OrganizationUser[]) => {
    if (!userData?.company?.companyId) return [];

    const isAdmin = userData?.company?.role === 'admin';
    const companyId = userData.company.companyId;

    return userList.filter(user => 
      user.roles?.some(role => role.companyId === companyId)
    );
  };

  return {
    filterVisibleCompanies,
    filterVisibleTeams,
    filterVisibleUsers,
    getUserCompanyId,
    getUserTeamIds
  };
}