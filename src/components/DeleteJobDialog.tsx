import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  loading?: boolean;
}

export default function DeleteJobDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  jobTitle,
  loading = false 
}: DeleteJobDialogProps) {
  const { t } = useTranslation();

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
          className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {t('jobs.delete_confirm_title')}
            </Dialog.Title>
          </div>

          <p className="text-gray-600 mb-6">
            {t('jobs.delete_confirm_message', { jobTitle })}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? t('common.deleting') : t('common.delete')}
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}