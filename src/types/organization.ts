export type CompanyRole = 'owner' | 'admin' | 'member';
export type TeamRole = 'lead' | 'manager' | 'member';

export interface Permission {
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  settings: {
    allowUserInvites: boolean;
    defaultRole: CompanyRole;
    enforceTeamIsolation: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  settings: {
    defaultRole: TeamRole;
    resourceAccess: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  companyId: string;
  teamId?: string;
  role: CompanyRole | TeamRole;
  permissions?: Permission[];
}

export interface OrganizationUser {
  id: string;
  email: string;
  name: string;
  roles?: UserRole[];
  settings: {
    defaultTeamId?: string;
  };
  createdAt: string;
  updatedAt: string;
}