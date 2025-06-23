import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export interface ContactFormProps {
  onClose?: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'companion', // default value
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for your interest! We will get back to you soon.');
        if (onClose) onClose();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-teal focus:ring-accent-teal sm:text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-teal focus:ring-accent-teal sm:text-sm"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-gray-700 text-left">
          I'm interested in
        </label>
        <select
          id="interest"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-teal focus:ring-accent-teal sm:text-sm"
          value={formData.interest}
          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
        >
          <option value="companion">Custom AI Companion</option>
          <option value="therapy">Therapeutic Support</option>
          <option value="coaching">Personal Growth & Coaching</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 text-left">
          Tell us more about what you're looking for
        </label>
        <textarea
          id="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-teal focus:ring-accent-teal sm:text-sm"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-teal hover:bg-accent-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-teal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
