import React from 'react';
import { Archive, RefreshCw } from 'lucide-react';
import { ArchiveReason } from '../types/archive';

interface ArchivedBadgeProps {
  reason: ArchiveReason;
  className?: string;
  onStatusChange?: () => void;
  canToggle?: boolean;
}

const reasonColors: Record<ArchiveReason, { bg: string; text: string }> = {
  hired: { bg: 'bg-green-100', text: 'text-green-800' },
  position_filled: { bg: 'bg-blue-100', text: 'text-blue-800' },
  position_cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  rejected: { bg: 'bg-orange-100', text: 'text-orange-800' },
  withdrawn: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  other: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

export default function ArchivedBadge({ 
  reason, 
  className = '', 
  onStatusChange,
  canToggle = false 
}: ArchivedBadgeProps) {
  const colors = reasonColors[reason];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium relative group
      ${colors.bg} ${colors.text} ${className}`}>
      <Archive size={14} />
      <span>
        {reason === 'position_filled' ? 'Filled' :
         reason === 'position_cancelled' ? 'Cancelled' :
         reason === 'rejected' ? 'Rejected' :
         reason === 'withdrawn' ? 'Withdrawn' :
         reason.charAt(0).toUpperCase() + reason.slice(1)}
      </span>
      {canToggle && (
        <button
          onClick={onStatusChange}
          className="ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-black/5"
          title="Change status"
        >
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
}