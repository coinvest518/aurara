"use client"

import { useState } from "react"
import { Check } from "lucide-react"

const plans = [
	{
		name: "Free",
		priceMonthly: 0,
		priceYearly: 0,
		description: "Basic access to Aurora features.",
		features: [
			"5 text/video AI sessions per month",
			"Basic mood tracker",
			"Limited chat access & support",
		],
		cta: "Get Started",
		highlight: false,
	},
	{
		name: "Essentials",
		priceMonthly: 9.99,
		priceYearly: 99.99,
		description: "For regular users who want more analytics and unlimited chats.",
		features: [
			"Unlimited text chats",
			"Mood & journal analytics",
			"Basic avatar video responses",
			"Email support",
		],
		cta: "Upgrade",
		highlight: false,
	},
	{
		name: "Pro",
		priceMonthly: 19.99,
		priceYearly: 191.9,
		description: "Full access, advanced analytics, and priority support.",
		features: [
			"Unlimited text + video sessions",
			"Real-time distress detection + grounding",
			"Advanced analytics & history view",
			"Priority support",
			"Save 20% annually",
		],
		cta: "Subscribe",
		highlight: true,
		badge: "Most Popular",
	},
]

interface PricingTabsProps {
	onSelectPlan?: (plan: string) => void
	currentPlan?: string
}

export default function PricingTabs({ onSelectPlan, currentPlan }: PricingTabsProps) {
	const [isAnnual, setIsAnnual] = useState(false)

	return (
		<div className="w-full bg-white rounded-3xl shadow-sm">
			<div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-6">
						Choose Your Plan
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Select the perfect plan for your needs. Upgrade or downgrade at any
						time.
					</p>
				</div>

				{/* Yearly/Monthly Toggle */}
				<div className="flex justify-center items-center gap-4 mb-16">
					<button
						onClick={() => setIsAnnual(false)}
						className={`px-6 py-3 rounded-full text-base font-semibold transition-all ${
							!isAnnual
								? "bg-blue-600 text-white shadow-md"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						Monthly
					</button>
					<button
						onClick={() => setIsAnnual(true)}
						className={`px-6 py-3 rounded-full text-base font-semibold transition-all ${
							isAnnual
								? "bg-blue-600 text-white shadow-md"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						Yearly
						{isAnnual && (
							<span className="ml-2 text-sm bg-blue-500 px-2 py-0.5 rounded-full">
								Save 20%
							</span>
						)}
					</button>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative bg-white rounded-2xl p-8 lg:p-10 flex flex-col justify-between min-h-[600px] ${
								plan.highlight
									? "ring-2 ring-blue-500 shadow-xl scale-[1.02] z-10"
									: "border border-gray-200 shadow-lg hover:border-gray-300 transition-all"
							}`}
						>
							{plan.badge && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
										{plan.badge}
									</span>
								</div>
							)}

							<div className="space-y-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold text-gray-900 mb-4">
										{plan.name}
									</h3>
									<div className="flex items-baseline justify-center mb-4">
										<span className="text-gray-900 text-4xl font-bold">$</span>
										<span className="text-gray-900 text-6xl font-bold tracking-tight">
											{isAnnual ? plan.priceYearly : plan.priceMonthly}
										</span>
										<span className="text-gray-600 ml-2 text-lg">
											/{isAnnual ? "year" : "month"}
										</span>
									</div>
									<p className="text-gray-600">
										{plan.description}
									</p>
								</div>

								<div className="space-y-6">
									<h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
										WHAT'S INCLUDED
									</h4>
									<ul className="space-y-4">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-start gap-3">
												<div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
													<Check className="w-3 h-3 text-green-600" />
												</div>
												<span className="text-gray-600">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>

							<button
								onClick={() => onSelectPlan?.(plan.name.toLowerCase())}
								disabled={currentPlan === plan.name.toLowerCase()}
								className={`w-full py-4 rounded-xl text-base font-semibold transition-all mt-8 ${
									currentPlan === plan.name.toLowerCase()
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: plan.highlight
										? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
										: "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
								}`}
							>
								{currentPlan === plan.name.toLowerCase()
									? "Current Plan"
									: plan.cta}
							</button>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<p className="text-gray-500">
						All plans include a 14-day free trial. No credit card required.
					</p>
				</div>
			</div>
		</div>
	)
}
