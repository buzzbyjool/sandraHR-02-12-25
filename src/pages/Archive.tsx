import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Search, Filter, Calendar, Building2, MapPin, Users, X } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useTranslation } from 'react-i18next';
import ArchivedJobList from '../components/archive/ArchivedJobList';
import ArchivedCandidateList from '../components/archive/ArchivedCandidateList';
import ArchiveFilters from '../components/archive/ArchiveFilters';

type ArchiveTab = 'jobs' | 'candidates';
type ViewMode = 'list' | 'grid';

export default function ArchivePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ArchiveTab>('jobs');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Archive className="text-indigo-600" size={24} />
            Archive
          </h1>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'candidates'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Candidates
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-500'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <ArchiveFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'jobs' ? (
          <ArchivedJobList itemsPerPage={itemsPerPage} viewMode={viewMode} />
        ) : (
          <ArchivedCandidateList itemsPerPage={itemsPerPage} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
}