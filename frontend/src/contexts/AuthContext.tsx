import React, { createContext, useEffect, useState } from 'react';
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

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.email);
      setCurrentUser(user);

      // Clean up previous Firestore listener
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (user) {
        console.log('Loading profile for UID:', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnap) => {
            console.log('Firestore document exists:', docSnap.exists());
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data) {
                const profile: UserProfile = {
                  uid: data.uid,
                  email: data.email,
                  fullName: data.fullName,
                  username: data.username,
                  role: data.role,
                  active: data.active
                };
                console.log('User profile loaded from Firestore:', JSON.stringify(profile, null, 2));
                setUserProfile(profile);
              }
            } else {
              console.log('User profile not found in Firestore for UID:', user.uid);
              setUserProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error loading user profile:', error);
            setUserProfile(null);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Moved to separate file to fix fast refresh warning
