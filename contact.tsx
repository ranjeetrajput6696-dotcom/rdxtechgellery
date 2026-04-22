import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { FormEvent, useState, ChangeEvent } from 'react';
import { createBooking, signInWithGoogle, subscribeToAuth } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('Success! Your message has been received. Check your email for confirmation.');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      setStatus('Failed to send. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen pb-24 font-body">
      {/* Header */}
      <section className="max-w-screen-2xl mx-auto px-6 mb-24 pt-12 text-center">
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6">
            <span className="w-6 h-px bg-primary"></span>
            Contact Us
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight mb-8">
            Let's Start Your <br/>
            <span className="text-texture italic">Visual Journey.</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Ready to book? The fastest way is a single phone call. For other inquiries, drop us a message below.
          </p>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Blocks */}
          <div className="lg:col-span-4 space-y-6">
            <a href="tel:7351608249" className="sleek-card p-8 bg-slate-900 border-none text-white flex items-center gap-6 group hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Phone className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Quick Booking</h3>
                <p className="text-xl font-bold">7351608249</p>
              </div>
            </a>

            <div className="sleek-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Email Address</h3>
                  <p className="text-xs text-on-surface-variant">ranjeetrajput6696@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Studio Location</h3>
                  <p className="text-xs text-on-surface-variant">New Delhi, India</p>
                </div>
              </div>
            </div>

            <div className="sleek-card p-8 bg-primary/5 border-primary/20">
              <h4 className="font-bold text-on-surface text-sm mb-4">Social Presence</h4>
              <div className="flex gap-4">
                {[
                  { name: 'Instagram', href: 'https://instagram.com/techsuneel' },
                  { name: 'Facebook', href: 'https://facebook.com/TECHSuneel' },
                  { name: 'YouTube', href: 'https://www.youtube.com/@TECHSuneel' }
                ].map(social => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold text-primary hover:underline font-mono"
                  >
                    {social.name.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="sleek-card p-8 md:p-12 space-y-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Name</label>
                  <input 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all text-on-surface" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all text-on-surface" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all text-on-surface appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Feedback</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Message</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all text-on-surface resize-none" 
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending...' : 'Send Message'}
                <MessageSquare className="w-5 h-5" />
              </button>
              
              {status && (
                <div className={`p-4 rounded-lg text-center text-xs font-bold uppercase tracking-widest ${status.includes('success') ? 'bg-success-bg text-success-text' : 'bg-red-50 text-red-600'}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
