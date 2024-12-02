import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, ChevronRight, ChevronLeft, Maximize2, Minimize2, ZoomIn, ZoomOut, Mail, Phone, MapPin, Building2, Calendar, Globe, Briefcase, Star, ChevronDown, Pencil } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import { Candidate } from '../../types/candidate';
import CandidateNotes from './CandidateNotes';
import EditCandidateModal from './EditCandidateModal';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CandidatePreviewProps {
  candidate: Candidate;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function CandidatePreview({ candidate, onClose, onNext, onPrevious }: CandidatePreviewProps) {
  const { t } = useTranslation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    additional: true,
    skills: true,
    experience: true,
    education: true,
    assessment: true,
    cv: true
  });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-2 text-lg font-semibold text-gray-900 group"
    >
      {title}
      <ChevronDown
        size={20}
        className={`text-gray-400 transition-transform duration-200 ${
          expandedSections[section] ? 'transform rotate-180' : ''
        }`}
      />
    </button>
  );

  return (
    <div className={`bg-white/90 rounded-lg shadow-sm overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Pencil size={16} />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ZoomIn size={20} />
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-2" />
          
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Notes
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        <div className="flex-1 overflow-auto px-6 py-4">
          {/* Basic Information */}
          <div className="mb-6">
            <SectionHeader title={t('candidate.basicInfo')} section="basic" />
            <AnimatePresence initial={false}>
              {expandedSections.basic && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">{t('candidate.email')}</p>
                        <p className="text-gray-900">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">{t('candidate.phone')}</p>
                        <p className="text-gray-900">{candidate.phone}</p>
                      </div>
                    </div>
                    {candidate.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">{t('candidate.location')}</p>
                          <p className="text-gray-900">{candidate.location}</p>
                        </div>
                      </div>
                    )}
                    {candidate.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">{t('candidate.address')}</p>
                          <p className="text-gray-900">{candidate.address}</p>
                        </div>
                      </div>
                    )}
                    {candidate.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">{t('candidate.currentCompany')}</p>
                          <p className="text-gray-900">{candidate.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <SectionHeader title={t('candidate.additionalInfo')} section="additional" />
            <AnimatePresence initial={false}>
              {expandedSections.additional && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {candidate.nationality && (
                      <div className="flex items-center gap-3">
                        <Globe className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">{t('candidate.nationality')}</p>
                          <p className="text-gray-900">{candidate.nationality}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">{t('candidate.workPermits')}</p>
                        <div className="flex gap-4 mt-1">
                          <span className={`text-sm ${candidate.residentInEU ? 'text-green-600' : 'text-gray-400'}`}>
                            {t('candidate.euResident')}
                          </span>
                          <span className={`text-sm ${candidate.workPermitEU ? 'text-green-600' : 'text-gray-400'}`}>
                            {t('candidate.euWorkPermit')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <SectionHeader title={t('candidate.skills')} section="skills" />
            <AnimatePresence initial={false}>
              {expandedSections.skills && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-4">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Assessment */}
          <div className="mb-6">
            <SectionHeader title={t('candidate.assessment')} section="assessment" />
            <AnimatePresence initial={false}>
              {expandedSections.assessment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400" size={20} fill="currentColor" />
                      <span className="text-lg font-medium">{candidate.rating}/10</span>
                    </div>
                    {candidate.iaSalaryEstimation && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">{t('candidate.aiSalaryEstimation')}</p>
                        <p className="text-lg font-medium">{candidate.iaSalaryEstimation.toLocaleString()}€</p>
                      </div>
                    )}
                    {candidate.sandraFeedback && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">{t('candidate.recruiterFeedback')}</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{candidate.sandraFeedback}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Experience */}
          {candidate.experience && candidate.experience.length > 0 && (
            <div className="mb-6">
              <SectionHeader title={t('candidate.experience')} section="experience" />
              <AnimatePresence initial={false}>
                {expandedSections.experience && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4">
                      {candidate.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">{exp.title}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.period}</p>
                          {exp.description && (
                            <p className="mt-2 text-gray-700">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="mb-6">
              <SectionHeader title={t('candidate.education')} section="education" />
              <AnimatePresence initial={false}>
                {expandedSections.education && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4">
                      {candidate.education.map((edu, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.graduationYear} • {edu.fieldOfStudy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CV Preview */}
          <div className="mb-6">
            <SectionHeader title={t('candidate.cvPreview')} section="cv" />
            <AnimatePresence initial={false}>
              {expandedSections.cv && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative pt-4">
                    {candidate.cvUrl && (
                      <Document
                        file={candidate.cvUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                          </div>
                        }
                      >
                        <Page
                          pageNumber={currentPage}
                          scale={zoom}
                          className="mx-auto"
                          loading={
                            <div className="flex items-center justify-center h-full">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                            </div>
                          }
                        />
                      </Document>
                    )}

                    {numPages && numPages > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm">
                          Page {currentPage} of {numPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                          disabled={currentPage === numPages}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notes Panel */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 overflow-hidden"
            >
              <CandidateNotes candidateId={candidate.id!} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <EditCandidateModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        candidate={candidate}
      />
    </div>
  );
}