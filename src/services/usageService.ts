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
}

export interface PlanLimits {
  video_sessions: number;
  text_sessions: number;
}

export const PLAN_LIMITS: Record<UserSubscription['subscription_type'], PlanLimits> = {
  free: {
    video_sessions: 2, // Only 2 free sessions
    text_sessions: 0
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
      
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      if (error) {
        // If not found, auto-create usage row for this user/month
        if (error.code === 'PGRST116' || error.message?.toLowerCase().includes('no rows')) {
          const newUsage = await this.initializeMonthlyUsage(userId);
          return newUsage;
        }
        console.error('Error fetching usage:', error);
        return null;
      }

      return data as UserUsage;
    } catch (error) {
      console.error('Unexpected error fetching usage:', error);
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
      if (!usage) return true; // First session of the month

      const { data: subscription } = await SubscriptionService.getUserSubscription(userId);
      const userPlan = subscription && 'plan_type' in subscription && subscription.plan_type ? subscription.plan_type : 'free';
      const plan = userPlan as UserSubscription['subscription_type'];
      const limits = PLAN_LIMITS[plan];

      if (limits[`${sessionType}_sessions`] === -1) return true; // Unlimited plan
      
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
      const userPlan = subscription && 'plan_type' in subscription && subscription.plan_type ? subscription.plan_type : 'free';
      const plan = userPlan as UserSubscription['subscription_type'];
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
