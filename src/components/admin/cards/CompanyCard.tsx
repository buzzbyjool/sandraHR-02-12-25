import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Calendar, Activity, Trash2 } from 'lucide-react';
import { Company } from '../../../types/organization';
import { useTeams } from '../../../hooks/useTeams';
import { useCompanies } from '../../../hooks/useCompanies';
import TeamList from './TeamList';
import { Dialog } from '@headlessui/react';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { teams } = useTeams();
  const { removeCompany } = useCompanies();
  const companyTeams = teams.filter(team => team.companyId === company.id);

  const handleDelete = async () => {
    try {
      await removeCompany(company.id);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Building2 className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users size={16} />
              <span>{companyTeams.length} teams</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-500">Active</span>
              <button
                onClick={() => setIsDeleting(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-2"
                title="Delete company"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Teams</h4>
          <TeamList teams={companyTeams} />
        </div>
      </div>
    </motion.div>

    <Dialog
      open={isDeleting}
      onClose={() => setIsDeleting(false)}
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
            Delete Company
          </Dialog.Title>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {company.name}? This action cannot be undone and will remove all associated teams and user assignments.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleting(false)}
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
    </>
  );
}