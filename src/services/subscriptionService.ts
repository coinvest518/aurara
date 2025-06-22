import { supabase } from '../supabaseClient'

export interface UserSubscription {
  id?: string
  user_id: string
  plan: string
  billing_cycle: 'monthly' | 'yearly'
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  stripe_session_id?: string
  current_period_start?: string
  current_period_end?: string
  created_at?: string
  updated_at?: string
}

export class SubscriptionService {
  /**
   * Create or update user subscription
   */
  static async upsertSubscription(subscription: UserSubscription): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          ...subscription,
          updated_at: new Date().toISOString()
        })
        .select()

      return { data, error }
    } catch (error) {
      console.error('Error upserting subscription:', error)
      return { data: null, error }
    }
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<{ data: UserSubscription | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error getting user subscription:', error)
      return { data: null, error }
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active')

      return { data, error }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { data: null, error }
    }
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      return !error && !!data
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return false
    }
  }

  /**
   * Get user's plan limits based on subscription
   */
  static async getUserPlanLimits(userId: string): Promise<{
    plan: string,
    monthlyTextSessions: number,
    monthlyVideoSessions: number,
    hasUnlimitedChats: boolean,
    hasAdvancedAnalytics: boolean,
    hasPrioritySupport: boolean
  }> {
    try {
      const { data: subscription } = await this.getUserSubscription(userId)
      
      if (!subscription) {
        // Free plan limits
        return {
          plan: 'free',
          monthlyTextSessions: 5,
          monthlyVideoSessions: 5,
          hasUnlimitedChats: false,
          hasAdvancedAnalytics: false,
          hasPrioritySupport: false
        }
      }

      // Return limits based on plan
      switch (subscription.plan) {
        case 'essentials':
          return {
            plan: 'essentials',
            monthlyTextSessions: -1, // unlimited
            monthlyVideoSessions: 10,
            hasUnlimitedChats: true,
            hasAdvancedAnalytics: true,
            hasPrioritySupport: false
          }
        case 'pro':
          return {
            plan: 'pro',
            monthlyTextSessions: -1, // unlimited
            monthlyVideoSessions: -1, // unlimited
            hasUnlimitedChats: true,
            hasAdvancedAnalytics: true,
            hasPrioritySupport: true
          }
        default:
          return {
            plan: 'free',
            monthlyTextSessions: 5,
            monthlyVideoSessions: 5,
            hasUnlimitedChats: false,
            hasAdvancedAnalytics: false,
            hasPrioritySupport: false
          }
      }
    } catch (error) {
      console.error('Error getting plan limits:', error)
      // Default to free plan on error
      return {
        plan: 'free',
        monthlyTextSessions: 5,
        monthlyVideoSessions: 5,
        hasUnlimitedChats: false,
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false
      }
    }
  }

  /**
   * Track usage for session limits
   */
  static async incrementSessionUsage(userId: string, sessionType: 'text' | 'video'): Promise<{ data: any, error: any }> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      const { data, error } = await supabase
        .from('user_usage')
        .upsert({
          user_id: userId,
          month: currentMonth,
          text_sessions: sessionType === 'text' ? 1 : 0,
          video_sessions: sessionType === 'video' ? 1 : 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, month',
          ignoreDuplicates: false
        })

      return { data, error }
    } catch (error) {
      console.error('Error incrementing session usage:', error)
      return { data: null, error }
    }
  }

  /**
   * Get current month usage
   */
  static async getCurrentMonthUsage(userId: string): Promise<{
    textSessions: number,
    videoSessions: number
  }> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      
      const { data, error } = await supabase
        .from('user_usage')
        .select('text_sessions, video_sessions')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single()

      if (error || !data) {
        return { textSessions: 0, videoSessions: 0 }
      }

      return {
        textSessions: data.text_sessions || 0,
        videoSessions: data.video_sessions || 0
      }
    } catch (error) {
      console.error('Error getting current month usage:', error)
      return { textSessions: 0, videoSessions: 0 }
    }
  }
}

/**
 * Check subscription status of a user
 */
export async function checkSubscriptionStatus(userId: string) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error checking subscription:', error)
    return null
  }

  if (!subscription) return 'free'

  // Check if subscription is active
  if (subscription.current_period_end) {
    const isActive = new Date(subscription.current_period_end) > new Date()
    return isActive ? subscription.subscription_type : 'free'
  }

  return subscription.subscription_type
}

/**
 * Update or create subscription for a user
 */
export async function updateSubscriptionStatus(userId: string, plan: string) {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      subscription_type: plan,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}
