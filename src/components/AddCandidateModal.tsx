import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ChevronDown, ChevronUp, Star, Plus, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCandidates } from '../hooks/useCandidates';
import { useCandidateJobs } from '../hooks/useCandidateJobs';
import FileUpload from './FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '../hooks/useDataContext';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
}

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

export default function AddCandidateModal({ isOpen, onClose, jobId }: AddCandidateModalProps) {
  const { t } = useTranslation();
  const { add } = useCandidates();
  const { add: addCandidateJob } = useCandidateJobs();
  const { getContextIds } = useDataContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    skills: '',
    location: '',
    address: '',
    nationality: '',
    residentInEU: false,
    workPermitEU: false,
    iaSalaryEstimation: '',
    sandraFeedback: '',
    available: '',
    notes: '',
    experience: [] as Experience[],
    education: [] as Education[],
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { companyId } = getContextIds();

    if (!companyId) {
      setError('Company context required');
      setLoading(false);
      return;
    }
    
    if (!formData.name || !formData.email || !formData.position) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const candidateData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        stage: 'new',
        status: 'In Progress',
        source: analyzing ? 'IA Web' : 'Manual Web' as const,
        companyId,
        rating,
      };

      const candidateId = await add(candidateData);
      
      // If a job was selected, create the relationship
      if (jobId) {
        await addCandidateJob({
          candidateId,
          jobId,
          companyId,
          companyId: candidateData.companyId,
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      onClose();
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        position: '',
        company: '',
        skills: '',
        location: '',
        address: '',
        nationality: '',
        residentInEU: false,
        workPermitEU: false,
        iaSalaryEstimation: '',
        sandraFeedback: '',
        available: '',
        notes: '',
        experience: [],
        education: [],
      });
      setRating(0);
      setSelectedFile(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error adding candidate:', error);
      setError(error.message || t('errors.add_candidate'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
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
              className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold">
                  {t('pipeline.add')}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    onClear={clearFile}
                  />

                  <button
                    type="button"
                    disabled={!selectedFile || analyzing}
                    onClick={() => {}}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed group hover:from-indigo-500 hover:to-blue-400 transition-all duration-200"
                  >
                    <Bot size={20} className="group-hover:animate-pulse" />
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFullForm(!showFullForm)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {showFullForm ? (
                      <>
                        <ChevronUp size={20} />
                        Hide Manual Form
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} />
                        Show Manual Form
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {showFullForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('candidate.firstName')} *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('candidate.surname')} *
                          </label>
                          <input
                            type="text"
                            name="surname"
                            required
                            value={formData.surname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('candidate.email')} *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('candidate.phone')} *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('candidate.position')} *
                          </label>
                          <input
                            type="text"
                            name="position"
                            required
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Additional Personal Information */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          {t('candidate.additionalInfo')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('candidate.address')}
                            </label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('candidate.nationality')}
                            </label>
                            <select
                              name="nationality"
                              value={formData.nationality}
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
                                checked={formData.residentInEU}
                                onChange={(e) => setFormData(prev => ({...prev, residentInEU: e.target.checked}))}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{t('candidate.euResident')}</span>
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="workPermitEU"
                                checked={formData.workPermitEU}
                                onChange={(e) => setFormData(prev => ({...prev, workPermitEU: e.target.checked}))}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{t('candidate.euWorkPermit')}</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Section */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          {t('candidate.assessment')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('candidate.aiSalaryEstimation')} (€)
                            </label>
                            <input
                              type="number"
                              name="iaSalaryEstimation"
                              value={formData.iaSalaryEstimation}
                              onChange={handleChange}
                              placeholder="e.g., 50000"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('candidate.recruiterFeedback')}
                            </label>
                            <textarea
                              name="sandraFeedback"
                              value={formData.sandraFeedback}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Enter recruiter feedback"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
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
                              onClick={() => setRating(index + 1)}
                              className="focus:outline-none"
                            >
                              <Star
                                size={24}
                                className={`${
                                  index < rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                } transition-colors`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            {rating}/10
                          </span>
                        </div>
                      </div>

                      {/* Experience Section */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          {t('candidate.experience')}
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

                      {/* Notes Section */}
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Enter any additional notes or comments about the candidate"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[100px]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    value={analyzing ? 'IA Web' : 'Manual Web'} 
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                  />
                </div>

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
                    {loading ? t('common.adding') : t('common.add')}
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