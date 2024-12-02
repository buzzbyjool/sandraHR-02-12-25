import React, { Fragment } from 'react';
import { Search, Bell, HelpCircle, Globe, Menu as MenuIcon, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { adminUser } = useAdmin();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#373F98]/90 to-[#0BDFE7]/90 backdrop-blur-lg shadow-lg fixed w-full top-0 z-40 border-b border-white/10">
      <div className="flex justify-between h-16">
        {/* Left section with logo */}
        <div className="flex items-center px-4">
          <img 
            src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/133961/218794_231809.png"
            alt="SANDRA HR"
            className="h-[42px] w-auto"
          />
        </div>

        {/* Center section with search */}
        <div className="flex-1 flex items-center justify-center px-4 max-w-2xl mx-auto">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0BDFE7] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right section with actions */}
        <div className="flex items-center space-x-2 md:space-x-4 px-4">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Globe className="text-white" size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Bell className="text-white" size={20} />
          </button>
          <button className="hidden md:block p-2 rounded-full hover:bg-white/10 transition-colors">
            <HelpCircle className="text-white" size={20} />
          </button>

          {adminUser && (
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-full hover:bg-white/10 transition-colors group"
              title="Admin Panel"
            >
              <Shield 
                className="text-white transition-transform group-hover:scale-110" 
                size={20} 
              />
            </button>
          )}

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0)}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/profile')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        {t('profile.view')}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        {t('auth.signout')}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}