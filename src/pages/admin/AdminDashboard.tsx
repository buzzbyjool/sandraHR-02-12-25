import React from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { Building2, Users, Shield } from 'lucide-react';
import CompanyManagement from './CompanyManagement';
import TeamManagement from './TeamManagement';
import UserManagement from './UserManagement';
import { useAdmin } from '../../hooks/useAdmin';
import { useCompanies } from '../../hooks/useCompanies';
import { useTeams } from '../../hooks/useTeams';
import { useUsers } from '../../hooks/useUsers';

export default function AdminDashboard() {
  const { adminUser, loading, error } = useAdmin();
  const { companies, loading: companiesLoading } = useCompanies();
  const { teams, loading: teamsLoading } = useTeams();
  const { users, loading: usersLoading } = useUsers();

  if (loading || companiesLoading || teamsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !adminUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Access Denied</p>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {adminUser.role}
          </span>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b border-gray-200">
          <Tab className={({ selected }) => `
            cursor-pointer
            px-4 py-2 text-sm font-medium focus:outline-none
            ${selected 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}>
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              Companies
            </div>
          </Tab>
          <Tab className={({ selected }) => `
            cursor-pointer
            px-4 py-2 text-sm font-medium focus:outline-none
            ${selected 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}>
            <div className="flex items-center gap-2">
              <Users size={18} />
              Teams
            </div>
          </Tab>
          <Tab className={({ selected }) => `
            cursor-pointer
            px-4 py-2 text-sm font-medium focus:outline-none
            ${selected 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}>
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Users
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <CompanyManagement />
          </Tab.Panel>
          <Tab.Panel>
            <TeamManagement />
          </Tab.Panel>
          <Tab.Panel>
            <UserManagement />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}