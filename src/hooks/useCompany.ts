import { useFirestore } from './useFirestore';
import { Company } from '../types/company';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from './useAdmin';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';

export function useCompany() {
  const { currentUser } = useAuth();
  const { adminUser } = useAdmin();
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { documents: companies } = useFirestore<Company>({
    collectionName: 'companies'
  });

  useEffect(() => {
    const fetchUserCompany = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        
        if (userData?.company?.companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', userData.company.companyId));
          if (companyDoc.exists()) {
            setCurrentCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          }
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompany();
  }, [currentUser]);

  const createCompany = async (data: Omit<Company, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('No authenticated user');
    if (!adminUser) throw new Error('Insufficient permissions');

    try {
      // Create company document
      const companyRef = doc(collection(db, 'companies'));
      const companyData: Omit<Company, 'id'> = {
        ...data,
        createdAt: new Date().toISOString(),
        settings: {
          allowUserInvites: true,
          defaultRole: 'member'
        }
      };

      await setDoc(companyRef, companyData);

      // Create company members collection and add creator as admin
      const memberRef = doc(db, 'companies', companyRef.id, 'members', currentUser.uid);
      await setDoc(memberRef, {
        role: 'admin',
        email: currentUser.email,
        name: currentUser.displayName,
        joinedAt: new Date().toISOString()
      });

      // Update user's company association
      await updateUserCompany(companyRef.id, 'admin');

      // Update local state
      setCurrentCompany({ id: companyRef.id, ...companyData });

      return companyRef.id;
    } catch (error) {
      console.error('Error creating company:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create company: ${error.message}`);
      }
      throw new Error('Failed to create company');
    }
  };

  const updateUserCompany = async (companyId: string, role: 'admin' | 'member') => {
    if (!currentUser) throw new Error('No authenticated user');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userData = {
        company: {
        companyId,
        role,
        joinedAt: new Date().toISOString()
        },
        roles: [{
          companyId,
          role,
          joinedAt: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, userData);
      
      // Fetch and set the updated company
      const companyDoc = await getDoc(doc(db, 'companies', companyId));
      if (companyDoc.exists()) {
        setCurrentCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
      }
    } catch (error) {
      console.error('Error updating user company:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update user company association: ${error.message}`);
      }
      throw new Error('Failed to update user company association');
    }
  };

  return {
    currentCompany,
    companies,
    loading,
    createCompany,
    updateUserCompany
  };
}