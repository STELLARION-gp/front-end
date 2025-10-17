// Frontend Authentication Check Component
// Add this to your chatbot component to ensure user is signed in

import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

export const useAuthRequired = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔍 Auth state changed:', firebaseUser?.email || 'Not signed in');
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};

// Use in your Chatbot component:
/*
const { user, loading, isAuthenticated } = useAuthRequired();

if (loading) return <div>Loading...</div>;
if (!isAuthenticated) {
  return (
    <div>
      <p>Please sign in to use the chatbot</p>
      <button onClick={() => signInWithPopup(auth, googleProvider)}>
        Sign In with Google
      </button>
    </div>
  );
}
*/
