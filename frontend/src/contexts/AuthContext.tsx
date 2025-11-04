import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  active: boolean;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.email);
      setCurrentUser(user);

      if (user) {
        console.log('Loading profile for UID:', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnap) => {
            console.log('Firestore document exists:', docSnap.exists());
            if (docSnap.exists()) {
              const profile = docSnap.data() as UserProfile;
              console.log('User profile loaded from Firestore:', JSON.stringify(profile, null, 2));
              setUserProfile(profile);
            } else {
              console.log('User profile not found in Firestore for UID:', user.uid);
              setUserProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error loading user profile:', error);
            setLoading(false);
          }
        );
        return () => unsubscribeFirestore();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
