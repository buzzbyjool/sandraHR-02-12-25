import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, ChevronRight } from 'lucide-react';
import { Team } from '../../../types/organization';
import { useUsers } from '../../../hooks/useUsers';
import { useDataVisibility } from '../../../hooks/useDataVisibility';

interface TeamListProps {
  teams: Team[];
}

export default function TeamList({ teams }: TeamListProps) {
  const { users } = useUsers();
  const { filterVisibleUsers } = useDataVisibility();
  const visibleUsers = filterVisibleUsers(users);

  const getTeamMembers = (teamId: string) => {
    return visibleUsers.filter(user => 
      user.roles?.some(role => role.teamId === teamId)
    );
  };

  const getTeamLead = (teamId: string) => {
    return visibleUsers.find(user =>
      user.roles?.some(role => role.teamId === teamId && role.role === 'lead')
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {teams.map(team => {
        const members = getTeamMembers(team.id);
        const lead = getTeamLead(team.id);
        
        return (
          <motion.div
            key={team.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Users size={14} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{team.name}</span>
            <span className="text-xs text-gray-500">({members.length})</span>
          </motion.div>
        );
      })}
    </div>
  );
}