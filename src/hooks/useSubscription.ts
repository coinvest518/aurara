import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PLAN_LIMITS } from '../types/subscription';
import type { 
  UserSubscription, 
  UsageLimit, 
  SubscriptionUsage, 
  FeatureKey
} from '../types/subscription';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUsage, setCurrentUsage] = useState<SubscriptionUsage>({
    textSessions: 0,
    videoSessions: 0
  });

  // Fetch subscription data
  useEffect(() => {
    async function fetchSubscription() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        setIsLoading(false);
        return;
      }

      setSubscription(data);
      setIsLoading(false);
    }

    fetchSubscription();
  }, []);

  // Fetch usage data
  useEffect(() => {
    async function fetchUsage() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Get text sessions count
      const { count: textCount } = await supabase
        .from('conversation_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', startOfMonth.toISOString());

      // Get video sessions count
      const { count: videoCount } = await supabase
        .from('video_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', startOfMonth.toISOString());

      setCurrentUsage({
        textSessions: textCount || 0,
        videoSessions: videoCount || 0
      });
    }

    fetchUsage();
  }, []);

  const hasActiveSubscription = subscription?.current_period_end 
    ? new Date(subscription.current_period_end) > new Date()
    : false;
  const currentPlan = hasActiveSubscription && subscription ? subscription.subscription_type : 'free';
  const planLimits: UsageLimit = PLAN_LIMITS[currentPlan];

  const canUseFeature = (feature: FeatureKey): boolean => {
    if (!hasActiveSubscription && currentPlan === 'free') {
      switch (feature) {
        case 'video_session':
          return currentUsage.videoSessions < planLimits.monthlyVideoSessions;
        case 'unlimited_chats':
          return currentUsage.textSessions < planLimits.monthlyTextSessions;
        default:
          return false;
      }
    }

    switch (feature) {
      case 'video_session':
        return planLimits.monthlyVideoSessions === -1 || 
               currentUsage.videoSessions < planLimits.monthlyVideoSessions;
      case 'unlimited_chats':
        return planLimits.hasUnlimitedChats;
      case 'advanced_analytics':
        return planLimits.hasAdvancedAnalytics;
      case 'priority_support':
        return planLimits.hasPrioritySupport;
      default:
        return false;
    }
  };

  return {
    subscription,
    hasActiveSubscription,
    isLoading,
    planLimits,
    currentPlan,
    currentUsage,
    canUseFeature
  };
}

