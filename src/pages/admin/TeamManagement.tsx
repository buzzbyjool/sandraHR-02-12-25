import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Trash2, Edit, Building2 } from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';
import { Team } from '../../types/organization';
import { Dialog } from '@headlessui/react';
import { useCompanies } from '../../hooks/useCompanies';

export default function TeamManagement() {
  const { teams, loading, error, addTeam, updateTeam, removeTeam } = useTeams();
  const { companies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyId: '',
    settings: {
      defaultRole: 'member' as const,
      resourceAccess: [] as string[]
    }
  });

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        setEditingTeam(null);
      } else {
        await addTeam({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setIsAddingTeam(false);
      }
      setFormData({
        name: '',
        description: '',
        companyId: '',
        settings: {
          defaultRole: 'member',
          resourceAccess: []
        }
      });
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingTeam) return;
    try {
      await removeTeam(deletingTeam.id);
      setDeletingTeam(null);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'Unknown Company';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => setIsAddingTeam(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Team
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTeam(team);
                      setFormData({
                        name: team.name,
                        description: team.description || '',
                        companyId: team.companyId,
                        settings: team.settings
                      });
                    }}
                    className="p-1 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingTeam(team)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Building2 size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {getCompanyName(team.companyId)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Team Modal */}
      <Dialog
        open={isAddingTeam || !!editingTeam}
        onClose={() => {
          setIsAddingTeam(false);
          setEditingTeam(null);
        }}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingTeam ? 'Edit Team' : 'Add Team'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <select
                  required
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Role
                </label>
                <select
                  value={formData.settings.defaultRole}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      defaultRole: e.target.value as 'member' | 'lead' | 'manager'
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTeam(false);
                    setEditingTeam(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {editingTeam ? 'Save Changes' : 'Add Team'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deletingTeam}
        onClose={() => setDeletingTeam(null)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Delete Team
            </Dialog.Title>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {deletingTeam?.name}? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingTeam(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}