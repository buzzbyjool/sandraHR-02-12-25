import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { useCompanies } from '../hooks/useCompanies';
import { useTeams, Team } from '../hooks/useTeams';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CompanySetup from '../components/CompanySetup';
import { Building2, Users, Shield } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();
  const { currentUser, userData } = useAuth();
  const { companies, loading: companiesLoading } = useCompanies();
  const { teams, loading: teamsLoading } = useTeams();
  const { adminUser } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCompanySetup, setShowCompanySetup] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const updateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.name
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
        updatedAt: new Date().toISOString()
      });

      setSuccess(t('profile.name_updated'));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(t('profile.update_failed'));
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('profile.passwords_not_match'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, formData.newPassword);
      
      setSuccess(t('profile.password_updated'));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(
        err.code === 'auth/wrong-password'
          ? t('profile.wrong_password')
          : t('profile.update_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('profile.personal_info')}</h2>
          
          <form onSubmit={updateName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.email')}
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('profile.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>

        <div className="border-t">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('company.title')}</h2>
            
            {companiesLoading || teamsLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : userData?.roles?.length > 0 ? (
              <div className="space-y-2">
                {userData.roles.map((role, index) => {
                  const company = companies.find(c => c.id === role.companyId);
                  const userTeams = teams.filter(team => 
                    role.companyId === team.companyId && 
                    userData.roles?.some(r => r.teamId === team.id)
                  );
                  
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="text-gray-400" size={20} />
                          <p className="font-medium text-gray-900">
                            {company?.name || t('company.unknown_company')}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          {role.role}
                        </span>
                      </div>
                      {userTeams.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="text-gray-400" size={16} />
                            <span>Teams:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {userTeams.map((team) => (
                              <span
                                key={team.id}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                              >
                                {team.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {adminUser && (
                  <div className="flex items-center gap-2 p-2 text-sm text-indigo-600">
                    <Shield size={16} />
                    <span>{adminUser.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">{t('company.no_company')}</p>
                {adminUser ? (
                  <button
                    onClick={() => setShowCompanySetup(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {t('company.create')}
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    {t('company.contact_admin')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('profile.change_password')}</h2>
            
            <form onSubmit={updateUserPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('profile.current_password')}
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('profile.new_password')}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('profile.confirm_password')}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? t('common.updating') : t('profile.update_password')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <CompanySetup
        isOpen={showCompanySetup}
        onClose={() => setShowCompanySetup(false)}
      />
    </div>
  );
}