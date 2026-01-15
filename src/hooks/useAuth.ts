 
import { useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, Product, Trip } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[useAuth] Error fetching profile:', error);
        return null;
      }

      setProfile(data ?? null);
      return data;
    } catch (err) {
      console.error('[useAuth] Exception fetching profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (): Promise<Product[] | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useAuth] Error fetching products:', error);
        return null;
      }

      return data ?? null;
    } catch (err) {
      console.error('[useAuth] Exception fetching products:', err);
      return null;
    }
  }, []);

  const fetchTrips = useCallback(async (): Promise<Trip[] | null> => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('[useAuth] Error fetching trips:', error);
        return null;
      }

      return data ?? null;
    } catch (err) {
      console.error('[useAuth] Exception fetching trips:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        else setProfile(null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // --- Sign in ---
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // --- Sign up (safe with RLS) ---
  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error('[useAuth] signUp error:', error);
      return { data, error };
    }
  
    if (fullName && data?.user?.id) {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: data.user.id,
            email,
            full_name: fullName,
          },
          { onConflict: 'id' }
        );
  
      if (upsertError) {
        console.error('[useAuth] error creating/updating user profile during signUp:', upsertError);
      }
    }
  
    return { data, error };
  };
  

  // --- Sign out ---
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // --- Update profile ---
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email || '',
          ...updates,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (!error) setProfile(data ?? null);

    return { data, error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    fetchProducts,
    fetchTrips,
  };
}
