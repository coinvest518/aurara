export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_type: 'free' | 'essentials' | 'pro';
  stripe_customer_id?: string;
  current_period_end?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UsageLimit {
  monthlyTextSessions: number;
  monthlyVideoSessions: number;
  hasUnlimitedChats: boolean;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
}

export interface SubscriptionUsage {
  textSessions: number;
  videoSessions: number;
  lastSessionDate?: string;
}

export type FeatureKey = 'video_session' | 'unlimited_chats' | 'advanced_analytics' | 'priority_support' | 'sendMessage';

export const PLAN_LIMITS: Record<UserSubscription['subscription_type'], UsageLimit> = {
  free: {
    monthlyTextSessions: 5,
    monthlyVideoSessions: 2,
    hasUnlimitedChats: false,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
  },
  essentials: {
    monthlyTextSessions: -1, // unlimited
    monthlyVideoSessions: 10,
    hasUnlimitedChats: true,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: false,
  },
  pro: {
    monthlyTextSessions: -1, // unlimited
    monthlyVideoSessions: -1, // unlimited
    hasUnlimitedChats: true,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
  },
};
