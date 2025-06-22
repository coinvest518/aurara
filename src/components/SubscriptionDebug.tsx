import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../supabaseClient';

export default function SubscriptionDebug() {
  const { subscription, hasActiveSubscription, isLoading, currentPlan } = useSubscription();

  const createTestSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        subscription_type: 'essentials',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (error) {
      console.error('Error creating test subscription:', error);
      alert('Error creating test subscription');
    } else {
      alert('Test subscription created!');
      window.location.reload();
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading subscription data...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Subscription Debug Info</h2>
        
        <div className="space-y-2">
          <p>
            <span className="font-medium">Current Plan:</span>{' '}
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {currentPlan}
            </span>
          </p>
          
          <p>
            <span className="font-medium">Active Subscription:</span>{' '}
            <span className={`px-2 py-1 rounded ${hasActiveSubscription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {hasActiveSubscription ? 'Yes' : 'No'}
            </span>
          </p>

          {subscription && (
            <>
              <p>
                <span className="font-medium">Expires:</span>{' '}
                {subscription.current_period_end ? (
                  new Date(subscription.current_period_end).toLocaleString()
                ) : 'N/A'}
              </p>
              
              {subscription.stripe_customer_id && (
                <p>
                  <span className="font-medium">Stripe Customer ID:</span>{' '}
                  {subscription.stripe_customer_id}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={createTestSubscription}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Create Test Subscription
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Raw Subscription Data:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(subscription, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
