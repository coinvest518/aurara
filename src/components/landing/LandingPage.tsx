import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { MessageCircle, Shield, Clock, Brain, ArrowRight, Loader2 } from 'lucide-react';
import Avatar from '../Avatar';
import CheckInSection from '../CheckInSection';
import { Auth } from '../Auth';
import { supabase } from '../../supabaseClient';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;

  description: string;
  className?: string;
}> = ({ icon, title, description, className }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={cn(
      'relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10',
      className
    )}
  >
    <div className="space-y-2">
      <div className="inline-block rounded-xl bg-accent-teal/10 p-2 text-accent-teal">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#33292c]">{title}</h3>
      <p className="text-sm text-[#81635d]">{description}</p>
    </div>
  </motion.div>
);

// Updated interface for the LandingPage component
interface LandingPageProps {
  onStartChat: () => Promise<void>;
  isApiConfigured?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat, isApiConfigured = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check for existing session
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuth(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleStartClick = async () => {
    if (!isApiConfigured) {
      // Show API configuration message
      alert('Please configure your API keys first');
      return;
    }
    if (!user) {
      setShowAuth(true);
      return;
    }
    setIsLoading(true);
    try {
      await onStartChat();
    } catch (error) {
      console.error('Failed to start chat:', error);
      setIsLoading(false);
    }
  };

  const StartButton = () => (
    <button
      onClick={handleStartClick}
      disabled={!isApiConfigured || isLoading}
      className="group inline-flex items-center justify-center space-x-2 rounded-xl bg-accent-teal px-8 py-4 text-lg font-semibold text-primary transition-all hover:bg-accent-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>{isApiConfigured ? 'Start Chatting Now' : 'Configure API Keys First'}</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
  return (
    <div className="min-h-screen bg-[#f6efef] text-[#33292c]">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 shadow backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset 0 animate-pulse rounded-xl bg-accent-teal/20" />
              <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-accent-teal">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-semibold text-[#33292c]">Aurora - AI Companion</span>
          </div>
          <button className="rounded-xl bg-accent-teal px-4 py-2 text-sm font-medium text-white hover:bg-accent-teal/90" onClick={() => setShowAuth(true)}>
            Sign In
          </button>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:text-left"
            >
              <div className="lg:py-24">
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#33292c] sm:mt-5 sm:text-6xl lg:mt-6">
                  <span className="block">Why Choose</span>
                  <span className="block text-accent-teal">Aurora?</span>
                </h1>
                <p className="mt-3 text-base text-[#81635d] sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Your personal AI companion combines emotional intelligence with professional expertise for meaningful, supportive conversations.
                </p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-accent-teal" />
                    <div>
                      <h3 className="font-semibold text-[#33292c]">24/7 Availability</h3>
                      <p className="text-sm text-[#81635d]">Always here when you need someone to talk to</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-accent-teal" />
                    <div>
                      <h3 className="font-semibold text-[#33292c]">Professional Guidance</h3>
                      <p className="text-sm text-[#81635d]">Evidence-based therapeutic techniques</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-accent-teal" />
                    <div>
                      <h3 className="font-semibold text-[#33292c]">Private & Secure</h3>
                      <p className="text-sm text-[#81635d]">End-to-end encrypted conversations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-6 w-6 text-accent-teal" />
                    <div>
                      <h3 className="font-semibold text-[#33292c]">Judgment-Free Space</h3>
                      <p className="text-sm text-[#81635d]">Open up freely and explore your thoughts</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 sm:mt-12">
                  <StartButton />
                </div>
              </div>
            </motion.div>
            <div className="mt-12 lg:mt-0">
              <div className="relative mx-auto max-w-lg pt-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative">
                    <Avatar
                      imageUrl="/assets/avatars/Tech Career Coach.png"
                      size="lg"
                      className="mx-auto mb-8"
                      isVideoAvatar={true}
                      alt="Aurora AI Video Avatar"
                    />
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-4 text-black">
                      <CheckInSection />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-[#f6efef] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#33292c]">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-lg text-[#81635d]">
              Join thousands of others who have found support, guidance, and clarity through Aurora.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-accent-teal" />}
              title="Personal Growth"
              description="Develop emotional awareness and build resilience through guided conversations and exercises."
              className="bg-white text-[#33292c] border-2 border-[#81635d] rounded-2xl shadow-none"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-accent-teal" />}
              title="Flexible Support"
              description="Access support on your schedule. Perfect for busy professionals and students."
              className="bg-white text-[#33292c] border-2 border-[#81635d] rounded-2xl shadow-none"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-accent-teal" />}
              title="Safe Environment"
              description="A judgment-free space where you can freely express your thoughts and feelings."
              className="bg-white text-[#33292c] border-2 border-[#81635d] rounded-2xl shadow-none"
            />
          </div>
          <div className="mt-12 text-center">
            <StartButton />
          </div>
        </div>
      </div>
      {/* About Aurora Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center rounded-2xl shadow-lg">
          {/* Left: About Aurora */}
          <div className="flex flex-col justify-center h-full">
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm mb-2">About Aurora</span>
            <h2 className="text-3xl font-bold text-[#33292c] mb-4">Discover How Aurora Can Help You</h2>
            <p className="text-base text-[#81635d] mb-4">
              Aurora is your AI companion, blending emotional intelligence with evidence-based therapeutic techniques. Inspired by leading research from Harvard, Stanford, and USC’s SimSensei, Aurora adapts to your needs, offering a safe, supportive space for growth and healing.
            </p>
            <ul className="space-y-2 text-[#33292c] mb-6">
              <li><span className="font-semibold text-accent-teal">Mission:</span> To empower users with accessible, empathetic, and effective mental health support, anytime, anywhere.</li>
              <li><span className="font-semibold text-accent-teal">Values:</span> Privacy, inclusivity, evidence-based care, and user empowerment.</li>
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-8">
              <div className="flex flex-col items-center bg-[#f6efef] rounded-xl p-4 shadow pb-8">
                <Shield className="h-8 w-8 text-accent-teal mb-2" />
                <span className="font-semibold text-[#33292c]">Disturbance</span>
                <span className="text-xs text-[#81635d] text-center">Support for emotional and mood disturbances</span>
              </div>
              <div className="flex flex-col items-center bg-[#f6efef] rounded-xl p-4 shadow pb-8">
                <Brain className="h-8 w-8 text-accent-teal mb-2" />
                <span className="font-semibold text-[#33292c]">Depression</span>
                <span className="text-xs text-[#81635d] text-center">Guidance for overcoming depressive thoughts</span>
              </div>
              <div className="flex flex-col items-center bg-[#f6efef] rounded-xl p-4 shadow pb-8">
                <MessageCircle className="h-8 w-8 text-accent-teal mb-2" />
                <span className="font-semibold text-[#33292c]">Neurosis</span>
                <span className="text-xs text-[#81635d] text-center">Tools for managing anxiety and stress</span>
              </div>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="flex justify-center items-center h-full">
            <img src="/assets/avatars/banner_persona.png" alt="Aurora About" className="rounded-2xl shadow-xl w-full max-w-md object-contain object-center" style={{height: '340px', background: '#f6efef'}} />
          </div>
        </div>
        {/* Approach Features */}
        <div className="mx-auto max-w-7xl mt-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#f6efef] rounded-xl shadow p-6 flex flex-col items-center">
              <Shield className="h-7 w-7 text-accent-teal mb-2" />
              <span className="font-semibold text-[#33292c]">Non-Patronizing</span>
              <span className="text-xs text-[#81635d] text-center">Empathetic, non-judgmental support for every user.</span>
            </div>
            <div className="bg-[#f6efef] rounded-xl shadow p-6 flex flex-col items-center">
              <Brain className="h-7 w-7 text-accent-teal mb-2" />
              <span className="font-semibold text-[#33292c]">Individually Tailored</span>
              <span className="text-xs text-[#81635d] text-center">Personalized exercises and advice based on your mood and needs.</span>
            </div>
            <div className="bg-[#f6efef] rounded-xl shadow p-6 flex flex-col items-center">
              <MessageCircle className="h-7 w-7 text-accent-teal mb-2" />
              <span className="font-semibold text-[#33292c]">Strengths-Focused</span>
              <span className="text-xs text-[#81635d] text-center">Celebrates your progress and builds on your strengths.</span>
            </div>
            <div className="bg-[#f6efef] rounded-xl shadow p-6 flex flex-col items-center">
              <Clock className="h-7 w-7 text-accent-teal mb-2" />
              <span className="font-semibold text-[#33292c]">Collaborative</span>
              <span className="text-xs text-[#81635d] text-center">Works with you to set goals and overcome challenges together.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-accent-teal/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm">Services</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">What Aurora Can Offer</h2>
            <p className="mt-4 text-lg text-slate-700">Choose the support that fits your needs—individual, couples, or group sessions, all powered by AI and real therapeutic techniques.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Individual Psychotherapy */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <img src="/assets/avatars/AI Interviewer.png" alt="Individual Therapy" className="w-20 h-20 rounded-full mb-4 shadow" />
              <span className="text-accent-teal font-bold text-2xl mb-2">01.</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Individual Psychotherapy</h3>
              <p className="text-slate-600 mb-4 text-center">Personalized, one-on-one support for your unique journey. Aurora adapts to your mood and goals, offering evidence-based exercises and empathetic conversation.</p>
              <button className="mt-auto px-6 py-2 rounded-lg bg-accent-teal text-white font-semibold hover:bg-accent-teal/90 transition">Book a Session</button>
            </div>
            {/* Couples Therapy */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <img src="/assets/avatars/charlie.png" alt="Couples Therapy" className="w-20 h-20 rounded-full mb-4 shadow" />
              <span className="text-accent-teal font-bold text-2xl mb-2">02.</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Couples Therapy</h3>
              <p className="text-slate-600 mb-4 text-center">Strengthen your relationship with guided conversations and exercises designed for couples, focusing on communication, empathy, and shared growth.</p>
              <button className="mt-auto px-6 py-2 rounded-lg bg-accent-teal text-white font-semibold hover:bg-accent-teal/90 transition">Book a Session</button>
            </div>
            {/* Group Therapy */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <img src="/assets/avatars/History Teacher.png" alt="Group Therapy" className="w-20 h-20 rounded-full mb-4 shadow" />
              <span className="text-accent-teal font-bold text-2xl mb-2">03.</span>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Group Therapy</h3>
              <p className="text-slate-600 mb-4 text-center">Join a supportive community. Aurora facilitates group sessions for shared experiences, learning, and encouragement in a safe, moderated space.</p>
              <button className="mt-auto px-6 py-2 rounded-lg bg-accent-teal text-white font-semibold hover:bg-accent-teal/90 transition">Book a Session</button>
            </div>
          </div>
        </div>
      </div>

      {/* Self-Discovery & Video Module Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center rounded-2xl shadow-lg">
          {/* Left: Self-Discovery */}
          <div>
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm">Self-Discovery</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">You Are the Main Puzzle</h2>
            <p className="mt-4 text-lg text-slate-700">Building a relationship with yourself is the foundation of growth. Aurora helps you explore your emotions, track your mood, and celebrate your progress with real, actionable insights.</p>
            <div className="mt-8 flex gap-4">
              <img src="/assets/avatars/mood log .png" alt="Mood Log" className="rounded-xl w-32 h-32 object-cover shadow" />
              <img src="/assets/avatars/Rose.png" alt="Rose Persona" className="rounded-xl w-32 h-32 object-cover shadow" />
            </div>
            <div className="mt-8 bg-accent-teal/10 rounded-xl pt-4 px-6 pb-2 text-accent-teal font-semibold flex justify-center items-center text-lg animate-pulse mb-8">
              <span className="text-center w-full">Live in Harmony, Believe in Yourself, Change Your Life</span>
            </div>
          </div>
          {/* Right: Video Module */}
          <div className="flex flex-col items-center">
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm mb-2">Watch How Aurora Works</span>
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-black">
              <video controls poster="/assets/avatars/daily mood log.avif" className="w-full h-64 object-cover">
                <source src="/assets/avatars/db374f03.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mt-4 text-slate-700 text-center">See Aurora in action—AI-powered support, real conversations, and a safe space for your journey.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-accent-teal/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm">Testimonials</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">What Users Say</h2>
            <p className="mt-4 text-lg text-slate-700">Real stories from people who found support, clarity, and growth with Aurora.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <MessageCircle className="h-8 w-8 text-accent-teal mb-4" />
              <p className="italic text-slate-700 mb-4 text-center">“Aurora helped me understand my emotions and gave me practical tools to manage my anxiety. I feel more in control and supported every day.”</p>
              <span className="font-semibold text-slate-900">— Jamie, 28</span>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <Brain className="h-8 w-8 text-accent-teal mb-4" />
              <p className="italic text-slate-700 mb-4 text-center">“The mood tracking and daily check-ins keep me motivated. Aurora feels like a real companion who listens and cares.”</p>
              <span className="font-semibold text-slate-900">— Alex, 34</span>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8">
              <Shield className="h-8 w-8 text-accent-teal mb-4" />
              <p className="italic text-slate-700 mb-4 text-center">“I love the privacy and the gentle, non-judgmental approach. Aurora is always there when I need to talk.”</p>
              <span className="font-semibold text-slate-900">— Taylor, 41</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white rounded-2xl shadow-lg py-16 px-6 mx-auto max-w-3xl text-center mt-16 mb-12">
        <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm">Call Me</span>
        <h2 className="mt-2 text-3xl font-bold text-black">Having a Hard Time? Let's Talk!</h2>
        <p className="mt-4 text-lg text-[#33292c]">Reach out for support, guidance, or just a listening ear. Aurora is here for you, every step of the way.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="tel:+1234567890" className="px-6 py-3 rounded-lg bg-accent-teal text-white font-semibold hover:bg-accent-teal/90 transition">Call Me Back</a>
          <a href="mailto:support@aurora.com" className="px-6 py-3 rounded-lg border border-accent-teal text-accent-teal font-semibold hover:bg-accent-teal/10 transition">Learn More</a>
        </div>
        <div className="mt-8 text-[#33292c] pb-4">
          <span className="font-semibold">Contact:</span> <a href="tel:+1234567890" className="text-accent-teal hover:underline">+1 (234) 567-890</a> &nbsp;|&nbsp; <a href="mailto:support@aurora.com" className="text-accent-teal hover:underline">support@aurora.com</a>
        </div>
      </div>

      {/* Blog Section */}
      <div className="bg-accent-teal/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent-teal font-semibold uppercase tracking-wider text-sm">Psychology Blog</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Insights & Resources</h2>
            <p className="mt-4 text-lg text-slate-700">Explore articles on emotional health, self-care, and the science behind Aurora’s approach.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Blog Article 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <img src="/assets/avatars/banner_persona.png" alt="Blog 1" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs text-accent-teal font-semibold mb-2">Self-Care</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">The Power of Daily Mood Tracking</h3>
                <span className="text-xs text-slate-400 mb-2">June 2025</span>
                <p className="text-slate-700 mb-4 flex-1">Discover how tracking your mood each day can reveal patterns, boost self-awareness, and help you take control of your emotional health.</p>
                <a href="#" className="text-accent-teal font-semibold hover:underline">Read More</a>
              </div>
            </div>
            {/* Blog Article 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <img src="/assets/avatars/Tech Career Coach.png" alt="Blog 2" className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs text-accent-teal font-semibold mb-2">Therapy Science</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">How AI Can Support Your Mental Health</h3>
                <span className="text-xs text-slate-400 mb-2">May 2025</span>
                <p className="text-slate-700 mb-4 flex-1">Learn about the science behind AI-powered therapy, and how Aurora uses evidence-based techniques to provide real support.</p>
                <a href="#" className="text-accent-teal font-semibold hover:underline">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#33292c] text-white py-12 mt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Logo & Links */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 animate-pulse rounded-xl bg-accent-teal/20" />
                <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-accent-teal">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="text-xl font-semibold">Aurora</span>
            </div>
            <nav className="flex flex-col space-y-2">
              <a href="#about" className="hover:underline">About</a>
              <a href="#services" className="hover:underline">Services</a>
              <a href="#blog" className="hover:underline">Blog</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </nav>
          </div>
          {/* Center: Address & Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-2">Find Me Here</h4>
            <p className="text-slate-300">123 Aurora Lane<br />San Francisco, CA 94110</p>
            <p className="mt-2 text-slate-300">support@aurora.com<br />+1 (234) 567-890</p>
          </div>
          {/* Right: Support & Social */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-2">Having a Hard Time?</h4>
            <p className="text-slate-300 mb-4">Aurora is here to support you. Follow us for updates and resources.</p>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#" className="hover:text-accent-teal" aria-label="Twitter">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6a4.28 4.28 0 0 1-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.28 0-.56-.02-.83-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg>
              </a>
              <a href="#" className="hover:text-accent-teal" aria-label="Facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.24 8.93v-6.32h-2.48v-2.61h2.48V9.41c0-2.45 1.49-3.8 3.77-3.8 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.61h-2.34v6.32c4.64-.86 8.24-4.52 8.24-8.93 0-5.5-4.46-9.96-9.96-9.96z"/></svg>
              </a>
              <a href="#" className="hover:text-accent-teal" aria-label="Instagram">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35 11.1c0-5.05-4.1-9.15-9.15-9.15S3.05 6.05 3.05 11.1c0 4.54 3.3 8.3 7.62 9.07v-6.42h-2.3v-2.65h2.3V9.41c0-2.28 1.39-3.53 3.5-3.53.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.41v1.7h2.52l-.4 2.65h-2.12v6.42c4.32-.77 7.62-4.53 7.62-9.07z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Aurora. All rights reserved.
        </div>
      </footer>

      {showAuth && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-md relative">
      <button
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
        onClick={() => setShowAuth(false)}
        aria-label="Close auth"
      >
        ×
      </button>
      <Auth onAuthSuccess={async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setShowAuth(false);
      }} />
    </div>
  </div>
)}
    </div>
  );
};

export default LandingPage;
