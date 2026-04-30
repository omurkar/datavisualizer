import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Save a session to Firestore
  const saveSession = async (sessionData) => {
    if (!user) return;
    const sessionRef = doc(collection(db, 'users', user.uid, 'sessions'));
    await setDoc(sessionRef, {
      ...sessionData,
      createdAt: new Date().toISOString(),
      userId: user.uid,
      userEmail: user.email,
    });
    return sessionRef.id;
  };

  // Get all sessions for current user
  const getSessions = async () => {
    if (!user) return [];
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    saveSession,
    getSessions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
