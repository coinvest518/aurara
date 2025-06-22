import { useSubscription } from '../hooks/useSubscription'
import { useNavigate } from 'react-router-dom'

export default function ExampleUsageComponent() {
  const { 
    subscription, 
    hasActiveSubscription, 
    planLimits, 
    currentUsage,
    canUseFeature,
    isLoading 
  } = useSubscription()
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Loading subscription data...</div>
  }

  const handleVideoSessionStart = () => {
    if (canUseFeature('video_session')) {
      // User can start video session
      console.log('Starting video session...')
      // TODO: Increment usage counter
      // await SubscriptionService.incrementSessionUsage(user.id, 'video')
    } else {
      // Show upgrade prompt
      alert('You\'ve reached your video session limit. Please upgrade your plan.')
      navigate('/pricing')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Subscription Status</h2>
      
      {/* Current Plan Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">Current Plan: {subscription?.subscription_type || 'free'}</h3>
        {hasActiveSubscription && (
          <p className="text-green-600">✓ Active Subscription</p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">This Month's Usage</h3>
        <div className="space-y-2">
          <div>
            <span>Text Sessions: </span>
            <span className="font-mono">
              {currentUsage.textSessions}
              {planLimits.monthlyTextSessions !== -1 && ` / ${planLimits.monthlyTextSessions}`}
            </span>
          </div>
          <div>
            <span>Video Sessions: </span>
            <span className="font-mono">
              {currentUsage.videoSessions}
              {planLimits.monthlyVideoSessions !== -1 && ` / ${planLimits.monthlyVideoSessions}`}
            </span>
          </div>
        </div>
      </div>

      {/* Feature Access */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Available Features</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={canUseFeature('unlimited_chats') ? 'text-green-600' : 'text-gray-400'}>
              {canUseFeature('unlimited_chats') ? '✓' : '✗'}
            </span>
            <span>Unlimited Chats</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={canUseFeature('advanced_analytics') ? 'text-green-600' : 'text-gray-400'}>
              {canUseFeature('advanced_analytics') ? '✓' : '✗'}
            </span>
            <span>Advanced Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={canUseFeature('priority_support') ? 'text-green-600' : 'text-gray-400'}>
              {canUseFeature('priority_support') ? '✓' : '✗'}
            </span>
            <span>Priority Support</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleVideoSessionStart}
          className={`w-full py-2 px-4 rounded-lg font-semibold ${
            canUseFeature('video_session')
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canUseFeature('video_session')}
        >
          Start Video Session
          {!canUseFeature('video_session') && ' (Limit Reached)'}
        </button>

        {!hasActiveSubscription && (
          <button
            onClick={() => navigate('/pricing')}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Upgrade Plan
          </button>
        )}
      </div>

      {/* Debug Info (remove in production) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-gray-500">Debug Info</summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify({ subscription, planLimits, currentUsage }, null, 2)}
        </pre>
      </details>
    </div>
  )
}
