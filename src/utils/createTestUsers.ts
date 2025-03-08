
import { supabase } from '@/integrations/supabase/client';

// This function will be used to create test users
export const createTestUsers = async () => {
  try {
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
    });

    if (adminError) throw adminError;

    // Set admin role
    if (adminData.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminData.user.id);

      if (updateError) throw updateError;
    }

    // Create regular user
    const { error: userError } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'user123',
    });

    if (userError) throw userError;

    console.log('Test users created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating test users:', error);
    return { success: false, error };
  }
};
