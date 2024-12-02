import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Star } from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';
import { formatDistanceToNow } from 'date-fns';

interface ArchivedCandidateListProps {
  itemsPerPage: number;
  viewMode: 'list' | 'grid';
}

export default function ArchivedCandidateList({ itemsPerPage, viewMode }: ArchivedCandidateListProps) {
  const { documents: candidates } = useCandidates();
  const [currentPage, setCurrentPage] = useState(1);

  const archivedCandidates = candidates.filter(candidate => candidate.status === 'archived');
  const paginatedCandidates = archivedCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="divide-y divide-gray-200">
      {paginatedCandidates.map(candidate => {
        const archiveDate = candidate.archiveMetadata?.archivedAt 
          ? formatDistanceToNow(new Date(candidate.archiveMetadata.archivedAt))
          : 'Unknown';

        return (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <Link 
                  to={`/candidates/${candidate.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                >
                  {candidate.name} {candidate.surname}
                </Link>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail size={16} />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Archived {archiveDate} ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="font-medium">{candidate.rating}/10</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}