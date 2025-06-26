import { supabase } from '../supabaseClient';
import { SubscriptionService } from './subscriptionService';
import type { UserSubscription } from '../types/subscription';

export interface UserUsage {
  id: string;
  user_id: string;
  video_sessions: number;
  text_sessions: number;
  month: string;  // YYYY-MM format
  created_at: string;
  updated_at: string;
  total_sessions?: number; // New field for total sessions
}

export interface PlanLimits {
  video_sessions: number;
  text_sessions: number;
  total_free_sessions?: number; // Total free sessions limit for free plan
}

export const PLAN_LIMITS: Record<UserSubscription['subscription_type'], PlanLimits> = {
  free: {
    video_sessions: 2, // Only 2 free sessions
    text_sessions: 0,
    total_free_sessions: 15 // Total free sessions limit
  },
  essentials: {
    video_sessions: 15,
    text_sessions: 50
  },
  pro: {
    video_sessions: -1,  // unlimited
    text_sessions: -1    // unlimited
  }
};

export class UsageService {
  static async getCurrentUsage(userId: string): Promise<UserUsage | null> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      // Get current month's usage
      const { data: currentUsage, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      // Get total sessions across all time
      const { count: totalSessions } = await supabase
        .from('user_usage')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error getting current usage:', error);
        return null;
      }

      return {
        id: currentUsage?.id || '',
        user_id: userId,
        video_sessions: currentUsage?.video_sessions || 0,
        text_sessions: currentUsage?.text_sessions || 0,
        month: currentMonth,
        total_sessions: totalSessions || 0,
        created_at: currentUsage?.created_at || new Date().toISOString(),
        updated_at: currentUsage?.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getCurrentUsage:', error);
      return null;
    }
  }

  static async initializeMonthlyUsage(userId: string): Promise<UserUsage | null> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const { data, error } = await supabase
        .from('user_usage')
        .insert([{
          user_id: userId,
          month: currentMonth,
          video_sessions: 0,
          text_sessions: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error initializing usage:', error);
        return null;
      }

      return data as UserUsage;
    } catch (error) {
      console.error('Unexpected error initializing usage:', error);
      return null;
    }
  }

  static async incrementUsage(userId: string, sessionType: 'video' | 'text'): Promise<boolean> {
    try {
      const usage = await this.getCurrentUsage(userId);
      
      if (!usage) {
        const newUsage = await this.initializeMonthlyUsage(userId);
        if (!newUsage) return false;
      }

      const column = `${sessionType}_sessions` as const;
      const { error } = await supabase
        .from('user_usage')
        .update({ 
          [column]: (usage?.[column] || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', usage?.id);

      if (error) {
        console.error('Error incrementing usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error incrementing usage:', error);
      return false;
    }
  }

  static async canStartSession(userId: string, sessionType: 'video' | 'text'): Promise<boolean> {
    try {
      const usage = await this.getCurrentUsage(userId);
      if (!usage) return true; // First session

      const { data: subscription } = await SubscriptionService.getUserSubscription(userId);
      const userPlan = (subscription?.plan || 'free') as 'free' | 'essentials' | 'pro';
      const limits = PLAN_LIMITS[userPlan];

      // Check total free sessions limit for free plan
      const totalSessions = usage.total_sessions || 0;
      if (userPlan === 'free' && totalSessions >= (limits.total_free_sessions || 15)) {
        return false;
      }

      // Check monthly limit
      if (limits[`${sessionType}_sessions`] === -1) return true; // Unlimited
      return usage[`${sessionType}_sessions`] < limits[`${sessionType}_sessions`];
    } catch (error) {
      console.error('Error checking session availability:', error);
      return false;
    }
  }

  static async checkUsageLimit(userId: string, sessionType: 'video' | 'text'): Promise<{ canUse: boolean; currentUsage: number; limit: number; error?: string }> {
    try {
      const usage = await this.getCurrentUsage(userId);
      const { data: subscription } = await SubscriptionService.getUserSubscription(userId);
      const plan = (subscription?.plan || 'free') as 'free' | 'essentials' | 'pro';
      const limits = PLAN_LIMITS[plan];
      const limit = limits[`${sessionType}_sessions`];
      const currentUsage = usage ? usage[`${sessionType}_sessions`] : 0;
      let canUse = true;
      if (limit !== -1 && currentUsage >= limit) {
        canUse = false;
      }
      return { canUse, currentUsage, limit };
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return { canUse: false, currentUsage: 0, limit: 0, error: 'Error checking usage limit' };
    }
  }
}
