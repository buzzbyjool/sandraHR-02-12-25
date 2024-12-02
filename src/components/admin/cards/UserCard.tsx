import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Calendar, Shield } from 'lucide-react';
import { OrganizationUser } from '../../../types/organization';
import { useCompanies } from '../../../hooks/useCompanies';
import { useTeams } from '../../../hooks/useTeams';

interface UserCardProps {
  user: OrganizationUser;
}

export default function UserCard({ user }: UserCardProps) {
  const { companies } = useCompanies();
  const { teams } = useTeams();

  const getUserCompany = (companyId: string) => {
    return companies.find(c => c.id === companyId);
  };

  const getUserTeams = () => {
    return user.roles
      .filter(role => role.teamId)
      .map(role => ({
        team: teams.find(t => t.id === role.teamId),
        role: role.role
      }))
      .filter(item => item.team);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {/* Company Badges */}
            {user.roles.map((role, index) => {
              const company = getUserCompany(role.companyId);
              if (!company) return null;
              
              return (
                <div
                  key={`company-${index}`}
                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                >
                  <Building2 size={14} />
                  <span className="text-sm font-medium">{company.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-indigo-100 rounded-full">
                    {role.role}
                  </span>
                </div>
              );
            })}
            
            {/* Team Badges */}
            {getUserTeams().map((item, index) => (
              <div
                key={`team-${index}`}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full"
              >
                <Users size={14} className="text-gray-500" />
                <span className="text-sm">{item.team?.name}</span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 rounded-full">
                  {item.role}
                </span>
              </div>
            ))}
          </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={14} />
              <span>{user.roles[0]?.role || 'No role'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}