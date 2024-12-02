import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { OrganizationUser } from '../../types/organization';
import { useCompanies } from '../../hooks/useCompanies';
import { useTeams } from '../../hooks/useTeams';
import CompanyTeamSelect from './CompanyTeamSelect';

interface UserModificationDialogProps {
  user: OrganizationUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function UserModificationDialog({
  user,
  isOpen,
  onClose,
  onSave
}: UserModificationDialogProps) {
  const { companies } = useCompanies();
  const { teams } = useTeams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    role: user?.roles?.[0]?.role || 'member',
    companyId: user?.roles?.[0]?.companyId || '',
    teamIds: user?.roles?.filter(r => r.teamId).map(r => r.teamId!) || []
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        role: user.roles?.[0]?.role || 'member',
        companyId: user.roles?.[0]?.companyId || '',
        teamIds: user.roles?.filter(r => r.teamId).map(r => r.teamId!) || []
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.companyId) {
      setError('Please select a company');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Modify User: {user?.name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  role: e.target.value
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="member">Member</option>
                <option value="lead">Lead</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <CompanyTeamSelect
              companies={companies}
              teams={teams}
              selectedCompanyId={formData.companyId}
              selectedTeamIds={formData.teamIds}
              onCompanyChange={(companyId) => setFormData(prev => ({
                ...prev,
                companyId,
                teamIds: [] // Reset team selection when company changes
              }))}
              onTeamChange={(teamIds) => setFormData(prev => ({
                ...prev,
                teamIds
              }))}
              error={error}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}