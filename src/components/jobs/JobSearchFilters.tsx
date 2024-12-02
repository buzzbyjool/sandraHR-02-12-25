import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Building2, Briefcase, Users, GraduationCap, Clock, X } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import { useTranslation } from 'react-i18next';

interface FilterState {
  companies: string[];
  departments: string[];
  locations: string[];
  types: string[];
  experience: string | null;
  education: string | null;
}

const educationLevels = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other'
];

const experienceLevels = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote'
];

export default function JobSearchFilters() {
  const { t } = useTranslation();
  const { documents: jobs } = useJobs();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    departments: [],
    locations: [],
    types: [],
    experience: null,
    education: null
  });

  // Extract unique values from jobs
  const uniqueCompanies = [...new Set(jobs.map(job => job.company))].sort();
  const uniqueDepartments = [...new Set(jobs.map(job => job.department))].sort();
  const uniqueLocations = [...new Set(jobs.map(job => job.location))].sort();

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      if (type === 'experience' || type === 'education') {
        return { ...prev, [type]: value };
      }
      
      const array = prev[type] as string[];
      return {
        ...prev,
        [type]: array.includes(value)
          ? array.filter(v => v !== value)
          : [...array, value]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      companies: [],
      departments: [],
      locations: [],
      types: [],
      experience: null,
      education: null
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== null
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
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

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Companies */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 size={16} />
                    Companies
                  </h4>
                  <div className="space-y-2">
                    {uniqueCompanies.map(company => (
                      <label key={company} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.companies.includes(company)}
                          onChange={() => handleFilterChange('companies', company)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{company}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Departments */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} />
                    Departments
                  </h4>
                  <div className="space-y-2">
                    {uniqueDepartments.map(department => (
                      <label key={department} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.departments.includes(department)}
                          onChange={() => handleFilterChange('departments', department)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{department}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} />
                    Locations
                  </h4>
                  <div className="space-y-2">
                    {uniqueLocations.map(location => (
                      <label key={location} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.locations.includes(location)}
                          onChange={() => handleFilterChange('locations', location)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase size={16} />
                    Employment Type
                  </h4>
                  <div className="space-y-2">
                    {employmentTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={() => handleFilterChange('types', type)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} />
                    Experience Level
                  </h4>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="experience"
                          checked={filters.experience === level}
                          onChange={() => handleFilterChange('experience', level)}
                          className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education Level */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap size={16} />
                    Education Level
                  </h4>
                  <div className="space-y-2">
                    {educationLevels.map(level => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="education"
                          checked={filters.education === level}
                          onChange={() => handleFilterChange('education', level)}
                          className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return value.map(v => (
                        <button
                          key={`${key}-${v}`}
                          onClick={() => handleFilterChange(key as keyof FilterState, v)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-sm
                            border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          {v}
                          <X size={14} />
                        </button>
                      ));
                    }
                    return value ? (
                      <button
                        key={key}
                        onClick={() => handleFilterChange(key as keyof FilterState, value)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-sm
                          border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        {value}
                        <X size={14} />
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}