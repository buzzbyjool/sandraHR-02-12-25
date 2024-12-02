import React from 'react';
import { statusColors } from '../types/candidateJob';
import { Tooltip } from './Tooltip';

interface StatusBadgeProps {
  status: keyof typeof statusColors;
  showLabel?: boolean;
}

export default function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const statusConfig = statusColors[status];

  return (
    <Tooltip content={statusConfig.description}>
      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm
          ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border
          transition-colors duration-200`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig.bg.replace('bg-', 'bg-opacity-80')}`}
        />
        {showLabel && statusConfig.label}
      </div>
    </Tooltip>
  );
}