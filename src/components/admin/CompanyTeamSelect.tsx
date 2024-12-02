import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Company } from '../../types/organization';
import { Team } from '../../types/organization';

interface CompanyTeamSelectProps {
  companies: Company[];
  teams: Team[];
  selectedCompanyId: string;
  selectedTeamIds: string[];
  onCompanyChange: (companyId: string) => void;
  onTeamChange: (teamIds: string[]) => void;
  error?: string;
}

export default function CompanyTeamSelect({
  companies,
  teams,
  selectedCompanyId,
  selectedTeamIds,
  onCompanyChange,
  onTeamChange,
  error
}: CompanyTeamSelectProps) {
  // Filter teams based on selected company
  const availableTeams = teams.filter(team => team.companyId === selectedCompanyId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedCompanyId}
            onChange={(e) => {
              onCompanyChange(e.target.value);
              onTeamChange([]); // Reset team selection when company changes
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teams
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            multiple
            value={selectedTeamIds}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              onTeamChange(selectedOptions);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px]"
            disabled={!selectedCompanyId}
          >
            {!selectedCompanyId ? (
              <option disabled>Select a company first</option>
            ) : availableTeams.length === 0 ? (
              <option disabled>No teams available</option>
            ) : (
              availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))
            )}
          </select>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Preview Section */}
      {(selectedCompanyId || selectedTeamIds.length > 0) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Selection</h4>
          {selectedCompanyId && (
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {companies.find(c => c.id === selectedCompanyId)?.name}
              </span>
            </div>
          )}
          {selectedTeamIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTeamIds.map(teamId => {
                const team = teams.find(t => t.id === teamId);
                return team ? (
                  <span
                    key={teamId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {team.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}