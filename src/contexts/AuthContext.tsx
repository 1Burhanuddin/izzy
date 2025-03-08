
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Profile = {
  id: string;
  username: string;
  role: string;
};

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, isAdmin?: boolean, adminCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
    setIsAdmin(data.role === 'admin');
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Signed in successfully');
      
      // Fetch user profile to check for admin status
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userData.user.id)
          .single();
        
        if (profileData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, isAdmin = false, adminCode = '') => {
    try {
      // Validate admin code if trying to register as admin
      const ADMIN_CODE = 'admin123';
      if (isAdmin && adminCode !== ADMIN_CODE) {
        toast.error('Invalid admin code');
        throw new Error('Invalid admin code');
      }

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: isAdmin ? 'admin' : 'customer'
          }
        }
      });
      
      if (error) throw error;
      
      // If admin code was provided and is valid, update the user's role in the profiles table
      if (isAdmin && data?.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating role:', updateError);
          toast.error('Account created but admin role assignment failed');
        } else {
          toast.success('Admin account created successfully!');
        }
      } else {
        toast.success('Registration successful! Please check your email for verification.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
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
