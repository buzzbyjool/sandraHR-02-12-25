import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, MapPin, Building2, Calendar, Star, Globe } from 'lucide-react';
import { Candidate } from '../../types/candidate';

interface CandidateQuickViewProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateQuickView({ candidate, isOpen, onClose }: CandidateQuickViewProps) {
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
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0BDFE7] to-[#373F98] rounded-full 
                flex items-center justify-center text-white text-lg font-semibold">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {candidate.name} {candidate.surname}
                </h2>
                <p className="text-gray-500">{candidate.position}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{candidate.phone}</p>
                </div>
              </div>
              {candidate.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{candidate.location}</p>
                  </div>
                </div>
              )}
              {candidate.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Current Company</p>
                    <p className="text-gray-900">{candidate.company}</p>
                  </div>
                </div>
              )}
            </div>

            {candidate.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {candidate.experience && candidate.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Experience</h3>
                <div className="space-y-4">
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
              </div>
            )}

            {candidate.education && candidate.education.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="space-y-4">
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
              </div>
            )}

            {candidate.rating > 0 && (
              <div className="flex items-center gap-2 mb-8">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="text-lg font-medium">{candidate.rating}/10</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}