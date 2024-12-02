export interface Company {
  id?: string;
  name: string;
  domain: string;
  createdAt: string;
  logo?: string;
  settings?: {
    allowUserInvites: boolean;
    defaultRole: string;
  };
}

export interface UserCompany {
  companyId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}