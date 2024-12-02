import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, Pencil, GitPullRequest, X, Building2, Archive } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import JobCandidateList from '../components/JobCandidateList';
import { useArchive } from '../hooks/useArchive';
import ArchiveDialog from '../components/ArchiveDialog';
import ArchivedBadge from '../components/ArchivedBadge';
import { toast } from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { documents: jobs, update, remove } = useJobs();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { archiveJob, updateArchiveStatus } = useArchive();

  const job = jobs.find(j => j.id === id);
  const [editForm, setEditForm] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    description: job?.description || '',
    requirements: job?.requirements?.join('\n') || '',
    company: job?.company || '',
  });

  if (!job) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job.id) return;

    try {
      setLoading(true);
      await update(job.id, {
        ...editForm,
        requirements: editForm.requirements.split('\n').filter(Boolean),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job.id) return;

    try {
      setLoading(true);
      await remove(job.id);
      navigate('/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleArchive = async (reason: ArchiveReason, notes: string) => {
    try {
      await archiveJob(job.id!, reason, notes);
      toast.success('Job archived successfully');
      navigate('/jobs');
    } catch (error) {
      console.error('Error archiving job:', error);
      toast.error('Failed to archive job');
    }
  };

  const handleStatusChange = async () => {
    if (!job?.id) return;
    try {
      await updateArchiveStatus(job.id, 'job', job.status === 'archived' ? 'active' : 'archived');
      toast.success(`Job ${job.status === 'archived' ? 'activated' : 'archived'} successfully`);
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/20"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-2 flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <Building2 size={18} />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={18} />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>0 candidates</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {job.status === 'archived' ? (
                <ArchivedBadge 
                  reason={job.archiveMetadata?.reason || 'other'}
                  onStatusChange={handleStatusChange}
                  canToggle={true}
                />
              ) : (
                <button
                  onClick={() => setShowArchiveDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Archive size={18} />
                  Archive
                </button>
              )}
              <motion.button
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-4 py-2 flex items-center gap-2
                  bg-white/80 backdrop-blur-sm border border-gray-200/50
                  rounded-lg shadow-sm hover:shadow-md
                  text-gray-700 hover:text-gray-900
                  transition-all duration-200"
              >
                <Pencil size={18} className="transition-transform group-hover:rotate-12" />
                <span className="relative z-10">{t('common.edit')}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/pipeline')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-4 py-2 flex items-center gap-2
                  bg-gradient-to-r from-[#373F98]/90 via-[#2A9BC1]/90 to-[#0BDFE7]/90
                  text-white rounded-lg font-medium 
                  shadow-[0_4px_20px_-1px_rgba(55,63,152,0.3)]
                  hover:shadow-[0_8px_25px_-1px_rgba(55,63,152,0.4)]
                  transition-all duration-300 ease-out
                  overflow-hidden
                  border border-white/10"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left center',
                }}
              >
                <GitPullRequest size={18} className="transition-transform group-hover:rotate-12" />
                <span className="relative z-10">{t('jobs.view_pipeline')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">{t('jobs.details')}</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">{t('jobs.requirements')}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Candidates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <JobCandidateList jobId={job.id!} />
      </motion.div>

      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold">
                {t('jobs.edit')}
              </Dialog.Title>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.title')}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.department')}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.location')}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.type')}
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.description')}
                </label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('jobs.requirements')}
                </label>
                <textarea
                  required
                  value={editForm.requirements}
                  onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                  rows={3}
                  placeholder="Enter each requirement on a new line"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  {t('common.delete')}
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? t('common.saving') : t('common.save')}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </Dialog>

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
              {t('jobs.delete_confirm')}
            </Dialog.Title>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
      
      <ArchiveDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        title={job.title}
        type="job"
      />
    </div>
  );
}