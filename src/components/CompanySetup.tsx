import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useCompany } from '../hooks/useCompany';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';

interface CompanySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanySetup({ isOpen, onClose }: CompanySetupProps) {
  const { t } = useTranslation();
  const { createCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCompany(formData);
      onClose();
    } catch (err) {
      console.error('Error creating company:', err);
      setError(t('company.create_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative"
        >
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <Dialog.Title className="text-xl font-semibold">
              {t('company.setup_title')}
            </Dialog.Title>
            <p className="text-gray-500 mt-2">
              {t('company.setup_description')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('company.name')}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={t('company.name_placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('company.domain')}
              </label>
              <input
                type="text"
                name="domain"
                required
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="example.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t('company.domain_help')}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? t('common.creating') : t('company.create')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}