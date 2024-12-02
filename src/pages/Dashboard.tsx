import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Users, Briefcase, CheckCircle, Clock, TrendingUp, ChevronDown, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useUserActivity } from '../hooks/useUserActivity';

function formatTimeAgo(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { activities, loading: activitiesLoading } = useUserActivity();
  const [showAllActivities, setShowAllActivities] = useState(false);

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);

  const stats = metrics ? [
    { icon: Briefcase, title: t('dashboard.positions'), value: metrics.activeJobs > 0 ? `${metrics.activeJobs} open` : '0 open' },
    { icon: Users, title: t('dashboard.candidates'), value: metrics.totalCandidates },
    { icon: Clock, title: 'Avg. Time to Hire', value: `${metrics.averageTimeToHire} days` },
    { icon: TrendingUp, title: 'Conversion Rate', value: `${metrics.conversionRates.hired}%` }
  ] : [
    { icon: Briefcase, title: t('dashboard.positions'), value: '0 open' },
    { icon: Users, title: t('dashboard.candidates'), value: '-' },
    { icon: Clock, title: 'Avg. Time to Hire', value: '-' },
    { icon: TrendingUp, title: 'Conversion Rate', value: '-' }
  ];

  const conversionData = metrics ? [
    { name: 'Screening', rate: metrics.conversionRates.screening },
    { name: 'Interview', rate: metrics.conversionRates.interview },
    { name: 'Offer', rate: metrics.conversionRates.offer },
    { name: 'Hired', rate: metrics.conversionRates.hired }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="text-2xl font-bold text-gray-900">
                  {metricsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
              <stat.icon className="text-indigo-500" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#6366f1" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dashboard.activities')}</h2>
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              {showAllActivities ? 'Show Less' : 'View All'}
              <ChevronDown
                size={16}
                className={`transform transition-transform ${showAllActivities ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          <div className="space-y-4">
            {activitiesLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
              ))
            ) : displayedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                </div>
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}