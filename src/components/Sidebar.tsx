import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GitPullRequest, Settings, Briefcase, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navItems = [
  { icon: LayoutDashboard, label: 'sidebar.dashboard', path: '/' },
  { icon: GitPullRequest, label: 'sidebar.pipeline', path: '/pipeline' },
  { icon: Users, label: 'sidebar.candidates', path: '/candidates' },
  { icon: Briefcase, label: 'sidebar.jobs', path: '/jobs' },
  { icon: Archive, label: 'sidebar.archive', path: '/archive' },
  { icon: Settings, label: 'sidebar.settings', path: '/settings' }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="h-full w-64 bg-white shadow-lg pt-16">
      <nav className="px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#0BDFE7] to-[#373F98] text-white shadow-md'
                  : 'text-gray-600 hover:bg-[#0BDFE7]/10'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}