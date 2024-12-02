import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CandidateList from './CandidateList';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { PanelRightClose, PanelRightOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedButton from '../AnimatedButton';
import AddCandidateModal from '../AddCandidateModal';

interface CandidateListPanelProps {
  onSelectCandidate: (id: string) => void;
  selectedCandidateId: string | null;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function CandidateListPanel({ onSelectCandidate, selectedCandidateId }: CandidateListPanelProps) {
  const { t } = useTranslation();
  const { showPreviewPanel, togglePreviewPanel, candidatesPerPage, setCandidatesPerPage } = useUIStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {t('sidebar.candidates')}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePreviewPanel}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 border border-gray-200 hover:border-indigo-200"
              aria-label={showPreviewPanel ? 'Hide preview panel' : 'Show preview panel'}
            >
              {showPreviewPanel ? (
                <PanelRightClose className="w-5 h-5 transition-transform duration-200" />
              ) : (
                <PanelRightOpen className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
            <AnimatedButton
              onClick={() => setIsAddModalOpen(true)}
              label={t('pipeline.add')}
            />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={candidatesPerPage}
              onChange={(e) => setCandidatesPerPage(Number(e.target.value))}
              className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        jobId={null}
      />

      <div className="flex-1 overflow-hidden">
        <CandidateList
          onSelectCandidate={onSelectCandidate}
          selectedCandidateId={selectedCandidateId}
          currentPage={currentPage}
          pageSize={candidatesPerPage}
        />
      </div>
    </div>
  );
}