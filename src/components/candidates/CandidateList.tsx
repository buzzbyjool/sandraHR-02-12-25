import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash.debounce';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidates } from '../../hooks/useCandidates';
import CandidateListItem from './CandidateListItem';
import { SortDirection, SortField } from '../../types/candidate';

interface CandidateListProps {
  onSelectCandidate: (id: string) => void;
  selectedCandidateId: string | null;
  currentPage: number;
  pageSize: number;
}

export default function CandidateList({ 
  onSelectCandidate, 
  selectedCandidateId,
  currentPage,
  pageSize
}: CandidateListProps) {
  const { documents: candidates, loading, remove } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<number | null>(null);

  // Infinite scroll setup
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(candidate => {
        const matchesSearch = searchTerm
          ? candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        const matchesSkills = skillFilter.length
          ? skillFilter.every(skill => candidate.skills.includes(skill))
          : true;

        return matchesSearch && matchesSkills;
      })
      .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'name') {
          return direction * a.name.localeCompare(b.name);
        }
        return direction * (new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime());
      });
  }, [candidates, searchTerm, sortField, sortDirection, skillFilter]);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const candidate = paginatedCandidates[index];
    if (!candidate) return null;

    return (
      <div style={style}>
        <CandidateListItem
          candidate={candidate}
          isSelected={selectedCandidateId === candidate.id}
          onClick={() => onSelectCandidate(candidate.id!)}
          onDelete={remove}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              onChange={e => debouncedSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <SlidersHorizontal size={20} className="text-gray-500" />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="Enter skills (comma separated)"
                  onChange={e => setSkillFilter(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  onChange={e => setExperienceFilter(parseInt(e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Name
              <ArrowUpDown size={16} />
            </button>
            <button
              onClick={() => handleSort('createdAt')}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Date
              <ArrowUpDown size={16} />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {filteredCandidates.length} candidates
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <List
            height={800}
            itemCount={paginatedCandidates.length}
            itemSize={100}
            width="100%"
          >
            {Row}
          </List>
          <div ref={ref} className="h-10" />
        </div>
      )}
    </div>
  );
}