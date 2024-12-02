import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Building2, Mail, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../hooks/useCompany';

interface WelcomeSplashProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeSplash({ isOpen, onClose }: WelcomeSplashProps) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { createCompany } = useCompany();

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                  >
                    <Building2 className="w-10 h-10 text-indigo-600" />
                  </motion.div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
                    {t('company.setup_title')}
                  </Dialog.Title>
                  <p className="text-gray-500">
                    {t('company.setup_description')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Company User?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      To activate your account, please contact your company's SandraHR administrator.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      New Customer?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Interested in SandraHR for your company? Let's discuss how we can help.
                    </p>
                    <a
                      href="mailto:sales@sandrahr.com"
                      className="block w-full px-4 py-2 bg-gradient-to-r from-[#373F98] to-[#0BDFE7] text-white rounded-lg hover:from-[#2F366F] hover:to-[#09B3B8] transition-colors text-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Mail size={18} />
                        Contact Sales
                      </span>
                    </a>
                  </motion.div>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Need help? Visit our{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                      Help Center
                    </a>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}