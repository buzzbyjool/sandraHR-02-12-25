import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Candidate } from '../../types/candidate';
import { useCandidates } from '../../hooks/useCandidates';
import { Star } from 'lucide-react';

interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  fieldOfStudy: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

export default function EditCandidateModal({ isOpen, onClose, candidate }: EditCandidateModalProps) {
  const { update, remove } = useCandidates();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    title: '',
    company: '',
    period: '',
    description: '',
  });

  const [currentEducation, setCurrentEducation] = useState<Education>({
    degree: '',
    institution: '',
    graduationYear: '',
    fieldOfStudy: '',
  });

  const [formData, setFormData] = useState({
    name: candidate.name,
    surname: candidate.surname,
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
    rating: candidate.rating,
    experience: candidate.experience || [],
    education: candidate.education || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate.id) return;

    try {
      setLoading(true);
      await update(candidate.id, {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        iaSalaryEstimation: formData.iaSalaryEstimation ? Number(formData.iaSalaryEstimation) : undefined,
        updatedAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error updating candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidate.id) return;

    try {
      setLoading(true);
      await remove(candidate.id);
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentExperience(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentEducation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addExperience = () => {
    if (currentExperience.title && currentExperience.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, currentExperience]
      }));
      setCurrentExperience({
        title: '',
        company: '',
        period: '',
        description: '',
      });
    }
  };

  const addEducation = () => {
    if (currentEducation.degree && currentEducation.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, currentEducation]
      }));
      setCurrentEducation({
        degree: '',
        institution: '',
        graduationYear: '',
        fieldOfStudy: '',
      });
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
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
          className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Edit Candidate
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete candidate"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
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
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: index + 1 })}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`${
                        index < formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {formData.rating}/10
                </span>
              </div>
            </div>

            {/* Experience Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Experience
              </h3>
              
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                  >
                    <X size={16} />
                  </button>
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.company} • {exp.period}</p>
                </div>
              ))}

              <div className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleExperienceChange}
                  placeholder="Job Title"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleExperienceChange}
                  placeholder="Company"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="period"
                  value={currentExperience.period}
                  onChange={handleExperienceChange}
                  placeholder="Period (e.g., 2020 - 2023)"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <textarea
                  name="description"
                  value={currentExperience.description}
                  onChange={handleExperienceChange}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Add Experience
                </button>
              </div>
            </div>

            {/* Education Section */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Education
              </h3>

              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                  >
                    <X size={16} />
                  </button>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-500">
                    {edu.institution} • {edu.graduationYear}
                  </p>
                  <p className="text-sm text-gray-500">{edu.fieldOfStudy}</p>
                </div>
              ))}

              <div className="space-y-3">
                <input
                  type="text"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleEducationChange}
                  placeholder="Degree"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleEducationChange}
                  placeholder="Institution"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="graduationYear"
                  value={currentEducation.graduationYear}
                  onChange={handleEducationChange}
                  placeholder="Graduation Year"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={currentEducation.fieldOfStudy}
                  onChange={handleEducationChange}
                  placeholder="Field of Study"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Add Education
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.residentInEU}
                  onChange={(e) => setFormData({ ...formData, residentInEU: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Resident in EU</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.workPermitEU}
                  onChange={(e) => setFormData({ ...formData, workPermitEU: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Work Permit in EU</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Enter skills separated by commas"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IA Salary Estimation (€)
              </label>
              <input
                type="number"
                value={formData.iaSalaryEstimation}
                onChange={(e) => setFormData({ ...formData, iaSalaryEstimation: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sandra Feedback
              </label>
              <textarea
                value={formData.sandraFeedback}
                onChange={(e) => setFormData({ ...formData, sandraFeedback: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

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
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        className="fixed z-[60] inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Delete Candidate
            </Dialog.Title>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {candidate.name} {candidate.surname}? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </Dialog>
  );
}