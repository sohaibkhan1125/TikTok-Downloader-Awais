import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    if (!auth) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    if (!auth) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Sign out
  const logout = async () => {
    if (!auth) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!auth) {
      return { success: false, error: 'Authentication service not available' };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Helper function to map Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Email already in use.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/wrong-password': 'Incorrect email or password.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
