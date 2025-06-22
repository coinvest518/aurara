import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'

export default function PaymentCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Cancel Icon */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>
          <p className="text-gray-600 mb-6">
            No worries! Your payment was canceled and you haven't been charged.
          </p>

          {/* Why did you cancel? */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need help choosing?</h3>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li>• Start with our free plan to try Aurora</li>
              <li>• Compare features to find the right fit</li>
              <li>• Contact support if you have questions</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Continue with Free Plan
            </button>
          </div>

          {/* Support Info */}
          <p className="text-sm text-gray-500 mt-6">
            Questions? Contact us at support@aurarora.life
          </p>
        </div>
      </div>
    </div>
  )
}
