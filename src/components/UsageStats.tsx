import React, { useEffect, useState } from 'react';
import { UsageService, UserUsage, PLAN_LIMITS } from '../services/usageService';
import { SubscriptionService } from '../services/subscriptionService';

type SubscriptionPlan = 'free' | 'essentials' | 'pro';

interface UsageStatsProps {
  userId: string;
}

export const UsageStats: React.FC<UsageStatsProps> = ({ userId }) => {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current usage
        const usageData = await UsageService.getCurrentUsage(userId);
        if (usageData) setUsage(usageData);

        // Get subscription
        const { data: subscription } = await SubscriptionService.getUserSubscription(userId);
        if (subscription) setPlan(subscription.plan as 'free' | 'essentials' | 'pro');

      } catch (error) {
        console.error('Error loading usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) return <div className="animate-pulse">Loading usage stats...</div>;

  const limits = PLAN_LIMITS[plan];
  const videoPercentage = limits.video_sessions === -1 ? 0 : 
    ((usage?.video_sessions || 0) / limits.video_sessions) * 100;
  const textPercentage = limits.text_sessions === -1 ? 0 :
    ((usage?.text_sessions || 0) / limits.text_sessions) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage This Month</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Video Sessions</span>
            <span>
              {usage?.video_sessions || 0} / {limits.video_sessions === -1 ? '∞' : limits.video_sessions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${
                videoPercentage > 90 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(videoPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Text Sessions</span>
            <span>
              {usage?.text_sessions || 0} / {limits.text_sessions === -1 ? '∞' : limits.text_sessions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${
                textPercentage > 90 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(textPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {plan === 'free' && (videoPercentage > 70 || textPercentage > 70) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            You're getting close to your usage limit! 
            <a href="/pricing" className="font-semibold ml-1 hover:underline">
              Upgrade now
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
