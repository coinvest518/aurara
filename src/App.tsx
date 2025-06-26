import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { supabase } from './supabaseClient';

const MainApp: React.FC = () => {
  const navigate = useNavigate();

  // On mount, check for existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <LandingPage 
      onStartChat={async () => navigate('/dashboard')}
      isApiConfigured={true} // We'll handle API configuration in the dashboard
    />
  );
};

export default MainApp;
