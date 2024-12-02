import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Candidate } from '../../types/candidate';
import CandidatePreview from './CandidatePreview';

interface CandidatePreviewPanelProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidatePreviewPanel({ candidate, onClose }: CandidatePreviewPanelProps) {
  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]/95 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{candidate.name} {candidate.surname}</h2>
          <p className="text-sm text-gray-500">{candidate.position}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100/80"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden bg-white/90">
        <CandidatePreview
          candidate={candidate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}