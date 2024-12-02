import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Building2, MapPin, Users, X } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';

interface ArchiveFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchiveFilters({ isOpen, onClose }: ArchiveFiltersProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const { documents: jobs } = useJobs();

  // Extract unique values
  const companies = [...new Set(jobs.map(job => job.company))];
  const departments = [...new Set(jobs.map(job => job.department))];
  const locations = [...new Set(jobs.map(job => job.location))];

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedCompanies([]);
    setSelectedDepartments([]);
    setSelectedLocations([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archive Date
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Companies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Companies
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {companies.map(company => (
                    <label key={company} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCompanies([...selectedCompanies, company]);
                          } else {
                            setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{company}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departments
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {departments.map(department => (
                    <label key={department} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments([...selectedDepartments, department]);
                          } else {
                            setSelectedDepartments(selectedDepartments.filter(d => d !== department));
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{department}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {locations.map(location => (
                    <label key={location} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLocations([...selectedLocations, location]);
                          } else {
                            setSelectedLocations(selectedLocations.filter(l => l !== location));
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-600">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}