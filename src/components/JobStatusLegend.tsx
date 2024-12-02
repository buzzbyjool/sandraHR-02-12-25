import React from 'react';
import { statusColors } from '../types/candidateJob';
import { motion } from 'framer-motion';

export default function JobStatusLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusColors).map(([key, config]) => (
          <div key={key} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${config.bg} ${config.border} border`} />
            <span className="text-sm text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}