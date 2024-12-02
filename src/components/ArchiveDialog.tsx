import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Archive, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArchiveReason } from '../types/archive';

interface ArchiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: ArchiveReason, notes: string) => Promise<void>;
  title: string;
  type: 'job' | 'candidate';
  loading?: boolean;
}

export default function ArchiveDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  type,
  loading = false
}: ArchiveDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<ArchiveReason>('hired');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason, notes);
  };

  const reasons: { value: ArchiveReason; label: string }[] = type === 'job' 
    ? [
        { value: 'position_filled', label: 'Position Filled' },
        { value: 'position_cancelled', label: 'Position Cancelled' },
        { value: 'other', label: 'Other' }
      ]
    : [
        { value: 'hired', label: 'Hired' },
        { value: 'other', label: 'Other' }
      ];

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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Archive className="w-5 h-5 text-indigo-600" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Archive {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Archiving
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ArchiveReason)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {reasons.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add any additional notes..."
              />
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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}