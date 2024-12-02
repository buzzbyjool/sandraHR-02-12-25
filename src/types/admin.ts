export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  isSuperAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended' | 'inactive';
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: string;
  status: 'success' | 'failure';
  metadata?: Record<string, any>;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  lastModified: string;
  modifiedBy: string;
}