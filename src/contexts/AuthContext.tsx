import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, db, googleProvider } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserCompany } from '../types/company';

interface UserData {
  name: string;
  email: string;
  roles?: Array<{
    companyId: string;
    teamId?: string;
    role: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            // Show welcome screen if user has no roles, empty roles array, or no company role
            const hasCompanyRole = data.roles?.some(role => role.companyId);
            setShowWelcome(!hasCompanyRole);
          } else {
            setShowWelcome(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setShowWelcome(true);
        }
      } else {
        setUserData(null);
        setShowWelcome(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : 'Failed to sign in');
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: name });
      
      const userData: UserData = {
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);
      setShowWelcome(true);
    } catch (err: any) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : err.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters'
          : 'Failed to create account'
      );
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, googleProvider);
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userData: UserData = {
          name: user.displayName || '',
          email: user.email || '',
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        setUserData(userData);
        setShowWelcome(true);
      }
    } catch (err: any) {
      setError(
        err.code === 'auth/popup-closed-by-user'
          ? 'Sign in cancelled'
          : 'Failed to sign in with Google'
      );
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserData(null);
      setShowWelcome(false);
    } catch (err: any) {
      setError('Failed to log out');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(
        err.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : 'Failed to send password reset email'
      );
      throw err;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    showWelcome,
    setShowWelcome,
    signIn,
    resetPassword,
    signUp,
    signInWithGoogle,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};