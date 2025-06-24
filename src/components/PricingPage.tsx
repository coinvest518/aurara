"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQ28r7E64YGcdlazSew80e?success_url=https://www.aurarora.life/success&cancel_url=https://www.aurarora.life/cancel"

const plans: Array<{
	name: string;
	priceMonthly: number;
	description: string;
	features: string[];
	cta: string;
	highlight: boolean;
	paymentLink: string;
	badge?: string;
	disabled?: boolean;
}> = [
	{
		name: "Basic",
		priceMonthly: 50,
		description: "Basic access to Aurora features with extra perks.",
		features: [
			"10 text/video AI sessions per month",
			"Advanced mood tracker",
			"Priority email support",
			"Access to exclusive content",
			"Early access to new features",
		],
		cta: "Subscribe Now",
		highlight: false,
		paymentLink: "https://buy.stripe.com/8x28wP5vYcr8elt6jCew80g",
	},
	{
		name: "Essentials",
		priceMonthly: 9.99,
		description:
			"For regular users who want more analytics and unlimited chats.",
		features: [
			"Unlimited text chats",
			"Mood & journal analytics",
			"Basic avatar video responses",
			"Email support",
		],
		cta: "Upgrade Now",
		highlight: true,
		paymentLink: STRIPE_PAYMENT_LINK,
		badge: "Most Popular",
	},
	{
		name: "Premium",
		priceMonthly: 191.99,
		description:
			"Full access, advanced analytics, and priority support.",
		features: [
			"Unlimited text + video sessions",
			"Real-time distress detection + grounding",
			"Advanced analytics & history view",
			"Priority support",
		],
		cta: "Subscribe Now",
		highlight: false,
		paymentLink: "https://buy.stripe.com/cNidR93nQ9eWcdl6jCew80h",
	},
]

export default function PricingPage() {
	const navigate = useNavigate();
	const [user] = useState(() => supabase.auth.getUser());

	const handlePlanSelection = async (plan: typeof plans[0]) => {
		if (plan.disabled) return;
		
		if (!user) {
			// Store the intended plan in sessionStorage
			sessionStorage.setItem('intended_plan', plan.name.toLowerCase());
			navigate('/login');
			return;
		}

		if (plan.paymentLink) {
			// Save the current URL to localStorage for redirect after payment
			localStorage.setItem('payment_return_url', window.location.href);
			window.location.href = plan.paymentLink;
		}
	};

	const handleBack = () => {
		navigate(-1); // Navigate to the previous page
	};

	return (
		<div className="min-h-screen bg-gray-50 py-20">
			<div className="w-full max-w-6xl mx-auto px-4">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Simple, Transparent Pricing
					</h1>
					<p className="text-xl text-gray-600">
						Choose the plan that best fits your needs.
					</p>
				</div>

				{/* Back Button */}
				<div className="text-center mb-8">
					<button
						onClick={handleBack}
						className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-200"
					>
						<svg
							className="w-4 h-4 mr-2 -ml-1"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 12H3m0 0l9-9m-9 9l9 9"
							/>
						</svg>
						Back
					</button>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
								plan.highlight
									? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20 scale-105 z-10"
									: "border-gray-200 hover:border-gray-300"
							} ${plan.disabled ? "opacity-75" : ""}`}
						>
							{/* Popular Badge */}
							{plan.badge && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
										{plan.badge}
									</span>
								</div>
							)}

							<div className="p-8">
								{/* Plan Header */}
								<div className="text-center mb-8">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{plan.name}
									</h3>
									<div className="flex items-baseline justify-center mb-4">
										<span className="text-5xl font-bold text-gray-900">
											${plan.priceMonthly}
										</span>
										<span className="text-gray-500 ml-1">
											/month
										</span>
									</div>
									<p className="text-gray-600 text-sm leading-relaxed">
										{plan.description}
									</p>
								</div>

								{/* CTA Button */}
								<button
									onClick={() => handlePlanSelection(plan)}
									disabled={plan.disabled}
									className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 mb-8 ${
										plan.highlight
											? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
											: plan.disabled
												? "bg-gray-100 text-gray-500 cursor-not-allowed"
												: "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
									}`}
								>
									{plan.cta}
								</button>

								{/* Features */}
								<div>
									<h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
										What's included:
									</h4>
									<ul className="space-y-3">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-start">
												<div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
													<Check className="w-3 h-3 text-green-600" />
												</div>
												<span className="text-gray-700 text-sm leading-relaxed">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<p className="text-gray-600 text-sm">
						All paid plans include a 14-day money-back guarantee.
					</p>
				</div>
			</div>
		</div>
	)
}
