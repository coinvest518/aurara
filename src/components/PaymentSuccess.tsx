import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { supabase } from '../supabaseClient'

interface PaymentSuccessProps {
  onSuccess?: () => void
}

export default function PaymentSuccess({ onSuccess }: PaymentSuccessProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const plan = searchParams.get('plan')
  const billing = searchParams.get('billing')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const updateUserSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('User not found. Please log in again.')
          return
        }

        if (!plan) {
          setError('Invalid plan information.')
          return
        }

        // Update user subscription status in your database
        // You might want to create a subscriptions table or add fields to users table
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            plan: plan,
            billing_cycle: billing || 'monthly',
            status: 'active',
            stripe_session_id: sessionId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          setError('Failed to update subscription status.')
          return
        }

        onSuccess?.()
        setLoading(false)
      } catch (err) {
        console.error('Error processing payment success:', err)
        setError('An error occurred while processing your subscription.')
        setLoading(false)
      }
    }

    updateUserSubscription()
  }, [plan, billing, sessionId, onSuccess])

  const planDetails = {
    essentials: {
      name: 'Essentials',
      price: billing === 'yearly' ? '$99.99/year' : '$9.99/month',
      features: [
        'Unlimited text chats',
        'Mood & journal analytics', 
        'Basic avatar video responses',
        'Email support'
      ]
    },
    pro: {
      name: 'Pro', 
      price: billing === 'yearly' ? '$191.90/year' : '$19.99/month',
      features: [
        'Unlimited text + video sessions',
        'Real-time distress detection + grounding',
        'Advanced analytics & history view',
        'Priority support'
      ]
    }
  }

  const currentPlan = plan && plan in planDetails ? planDetails[plan as keyof typeof planDetails] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Aurora {currentPlan?.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully.
          </p>

          {/* Plan Details */}
          {currentPlan && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{currentPlan.name} Plan</h3>
              <p className="text-blue-600 font-bold mb-4">{currentPlan.price}</p>
              <ul className="text-left space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Support Info */}
          <p className="text-sm text-gray-500 mt-6">
            Need help? Contact us at support@aurarora.life
          </p>
        </div>
      </div>
    </div>
  )
}
