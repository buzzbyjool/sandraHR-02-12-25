import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import JobForm from './JobForm';
import { useJobForm } from '../hooks/useJobForm';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (jobId: string) => void;
}

export default function AddJobModal({ isOpen, onClose, onSuccess }: AddJobModalProps) {
  const { t } = useTranslation();
  const { formData, setFormData, loading, error, handleSubmit, resetForm } = useJobForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.company || !formData.department) {
        throw new Error('Please fill in all required fields');
      }

      const jobId = await handleSubmit();
      if (onSuccess) {
        onSuccess(jobId);
      }
      resetForm();
      onClose();
    } catch (err) {
      const error = err as Error;
      console.error('Error submitting job:', error);
      // Error is already handled by the hook
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  {t('jobs.add')}
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

              <form onSubmit={handleFormSubmit}>
                <JobForm
                  formData={formData}
                  onChange={setFormData}
                  disabled={loading}
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? t('common.creating') : t('common.create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}