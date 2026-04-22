import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updateBookingPayment } from '../lib/firebase';

interface PaymentFormProps {
  bookingId: string;
  amount: number; // in cents
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ bookingId, amount, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Update Firebase
        await updateBookingPayment(bookingId, 'Partial', amount / 100);
        setIsFinished(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } catch (err) {
        console.error("Firestore update error:", err);
        setMessage("Payment succeeded but database update failed. Please contact support.");
      }
    } else {
      setMessage("Something went wrong.");
      setIsLoading(false);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center text-success mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-on-surface-variant">Your booking advance has been confirmed.</p>
      </div>
    );
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Booking Advance</h4>
        <div className="text-3xl font-black text-primary">₹{(amount / 100).toLocaleString()}</div>
      </div>

      <PaymentElement id="payment-element" />

      {message && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {message}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Pay ₹${(amount / 100).toLocaleString()} Now`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-4 bg-slate-100 text-on-surface font-bold rounded-xl hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
