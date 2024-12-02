import React, { useState } from 'react';
import { useUserModification } from '../../hooks/useUserModification';
import { useTeams } from '../../hooks/useTeams';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { OrganizationUser } from '../../types/organization';

interface UserModificationFormProps {
  user: OrganizationUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModificationForm({ 
  user, 
  isOpen, 
  onClose 
}: UserModificationFormProps) {
  const { modifyUser, updateUserTeams, loading, error } = useUserModification();
  const { teams } = useTeams();
  const [formData, setFormData] = useState({
    role: user.roles[0]?.role || 'member',
    teamIds: user.roles
      .filter(r => r.teamId)
      .map(r => r.teamId!) || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update user role
      const roleSuccess = await modifyUser({
        userId: user.id,
        role: formData.role as any
      });

      // Update team assignments if role update was successful
      if (roleSuccess && formData.teamIds.length > 0) {
        await updateUserTeams(user.id, formData.teamIds);
      }

      onClose();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
            Modify User: {user.name}
          </Dialog.Title>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teams
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {teams.map((team) => (
                  <label key={team.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.teamIds.includes(team.id)}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          teamIds: e.target.checked
                            ? [...prev.teamIds, team.id]
                            : prev.teamIds.filter(id => id !== team.id)
                        }));
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{team.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
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
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}