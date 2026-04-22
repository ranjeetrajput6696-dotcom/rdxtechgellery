import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import PaymentForm from './PaymentForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number; // in cents
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, bookingId, amount, onSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !clientSecret && amount > 0) {
      createPaymentIntent();
    }
  }, [isOpen]);

  const createPaymentIntent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bookingId }),
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || "Failed to initialize payment.");
      }
    } catch (err) {
      console.error("Payment init error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb', // Matches blue-600
      borderRadius: '12px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="p-8 border-b border-divider flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Secure Checkout</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Powered by Stripe</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-sm font-bold text-on-surface-variant animate-pulse">Initializing Secure Payment...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Initialization Failed</h4>
                  <p className="text-sm text-on-surface-variant mb-8">{error}</p>
                  <button 
                    onClick={createPaymentIntent}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <PaymentForm 
                    bookingId={bookingId} 
                    amount={amount} 
                    onSuccess={onSuccess} 
                    onCancel={onClose}
                  />
                </Elements>
              ) : null}
            </div>

            <div className="px-8 pb-8 flex items-center justify-center gap-4 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest border-t border-divider pt-6">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL SECURE</span>
              <span>•</span>
              <span>256-BIT ENCRYPTION</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
