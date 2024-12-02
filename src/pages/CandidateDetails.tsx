import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, Calendar, Star, Link as LinkIcon, Pencil, X, Save, Trash2, Archive } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';
import { useTranslation } from 'react-i18next';
import CandidateJobList from '../components/CandidateJobList';
import { Dialog } from '@headlessui/react';
import { useArchive } from '../hooks/useArchive';
import ArchiveDialog from '../components/ArchiveDialog';
import ArchivedBadge from '../components/ArchivedBadge';
import { toast } from 'react-hot-toast';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { documents: candidates, loading, error: candidateError, update, remove } = useCandidates();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { archiveCandidate } = useArchive();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const [editForm, setEditForm] = useState({
    name: '', 
    surname: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    location: '',
    address: '',
    nationality: '',
    residentInEU: false,
    workPermitEU: false,
    iaSalaryEstimation: '',
    sandraFeedback: '',
    skills: '',
    notes: '',
    rating: 0
  });

  const candidate = candidates.find(c => c.id === id);

  // Update form data when candidate changes
  useEffect(() => {
    if (candidate) {
      setEditForm({
        name: candidate.name || '',
        surname: candidate.surname || '',
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        company: candidate.company,
        location: candidate.location || '',
        address: candidate.address || '',
        nationality: candidate.nationality || '',
        residentInEU: candidate.residentInEU || false,
        workPermitEU: candidate.workPermitEU || false,
        iaSalaryEstimation: candidate.iaSalaryEstimation?.toString() || '',
        sandraFeedback: candidate.sandraFeedback || '',
        skills: candidate.skills.join(', '),
        notes: candidate.notes || '',
        rating: candidate.rating || 0
      });
    }
  }, [candidate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate?.id) return;

    try {
      setIsLoading(true);
      await update(candidate.id, {
        ...editForm,
        skills: editForm.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        iaSalaryEstimation: editForm.iaSalaryEstimation ? Number(editForm.iaSalaryEstimation) : undefined,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating candidate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidate?.id) return;

    try {
      setIsLoading(true);
      await remove(candidate.id);
      navigate('/candidates');
    } catch (error) {
      console.error('Error deleting candidate:', error);
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (candidateError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error loading candidate: {candidateError}</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Candidate not found</p>
      </div>
    );
  }
  const handleArchive = async (reason: ArchiveReason, notes: string) => {
    try {
      await archiveCandidate(candidate.id!, reason, notes);
      toast.success('Candidate archived successfully');
      navigate('/candidates');
    } catch (error) {
      console.error('Error archiving candidate:', error);
      toast.error('Failed to archive candidate');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0BDFE7] to-[#373F98] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="text-gray-500">
                  {candidate.position} {candidate.company && `at ${candidate.company}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {candidate.status === 'archived' ? (
                <ArchivedBadge reason={candidate.archiveMetadata?.reason || 'other'} />
              ) : (
                <button
                  onClick={() => setShowArchiveDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Archive size={18} />
                  Archive
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {isEditing ? (
                  <>
                    <X size={20} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil size={20} />
                    {t('common.edit')}
                  </>
                )}
              </button>
              <button
                onClick={() => setIsDeleting(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={20} />
                {t('common.delete')}
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.firstName')}
                  </label>
                  <input
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.surname')}
                  </label>
                  <input
                    type="text"
                    value={editForm.surname}
                    onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.email')}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.phone')}
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.position')}
                  </label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.company')}
                  </label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('candidate.location')}
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Additional Personal Information */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Additional Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea 
                      name="address"
                      value={editForm.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <select 
                      name="nationality"
                      value={editForm.nationality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select nationality</option>
                      <option value="FR">French</option>
                      <option value="DE">German</option>
                      <option value="IT">Italian</option>
                      <option value="ES">Spanish</option>
                      <option value="UK">British</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="residentInEU"
                        checked={editForm.residentInEU}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          residentInEU: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Resident in EU</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="workPermitEU"
                        checked={editForm.workPermitEU}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          workPermitEU: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Work Permit in EU</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Assessment Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Assessment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IA Salary Estimation (€)
                    </label>
                    <input 
                      type="number"
                      name="iaSalaryEstimation"
                      value={editForm.iaSalaryEstimation}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sandra Feedback
                    </label>
                    <textarea 
                      name="sandraFeedback"
                      value={editForm.sandraFeedback}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter recruiter feedback"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('candidate.skills')}
                </label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="Enter skills separated by commas"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('candidate.notes')}
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('candidate.rating')}
                </label>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: index + 1 })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          index < editForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {editForm.rating}/10
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save size={20} />
                  {isLoading ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={20} />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">Full Name:</span>
                  <span>{candidate.name} {candidate.surname}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={20} />
                  <span>{candidate.phone}</span>
                </div>
                {candidate.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={20} />
                    <span>{candidate.location}</span>
                  </div>
                )}
                {candidate.available && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={20} />
                    <span>Available from {candidate.available}</span>
                  </div>
                )}
                {candidate.nationality && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">Nationality:</span>
                    <span>{candidate.nationality}</span>
                  </div>
                )}
                {candidate.address && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">Address:</span>
                    <span>{candidate.address}</span>
                  </div>
                )}
                {candidate.iaSalaryEstimation && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="font-medium">IA Salary Estimation:</span>
                    <span>{candidate.iaSalaryEstimation}€</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">{t('candidate.skills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {candidate.notes && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-4">{t('candidate.notes')}</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{candidate.notes}</p>
                </div>
              )}
              
              {candidate.sandraFeedback && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-4">Sandra Feedback</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{candidate.sandraFeedback}</p>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">{t('candidate.rating')}</h2>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, index) => (
                    <Star
                      key={index}
                      size={24}
                      className={`${
                        index < (candidate.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {candidate.rating || 0}/10
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Source: {candidate.source}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Jobs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <CandidateJobList candidateId={candidate.id!} />
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
              Delete Candidate
            </Dialog.Title>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this candidate? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
      
      <ArchiveDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchive}
        title={`${candidate.name} ${candidate.surname}`}
        type="candidate"
      />
    </div>
  );
}