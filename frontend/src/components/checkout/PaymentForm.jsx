
import React, { useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentForm = ({
  createOrder,
  verifyPayment,
  billingDetails = {},
  razorpayKeyId,
  amount,
  currency = 'INR',
  disabled = false,
  onSuccess,
  onError,
  onCancel,
  description = 'Digital Heroes PrintForge order',
  className = '',
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (processing || disabled) return;

    setError('');

    if (!razorpayKeyId) {
      setError('Payment configuration is unavailable. Please try again later.');
      return;
    }

    if (typeof createOrder !== 'function' || typeof verifyPayment !== 'function') {
      setError('Payment service is not configured correctly.');
      return;
    }

    if (
      !billingDetails.fullName ||
      !billingDetails.email ||
      !billingDetails.phone
    ) {
      setError('Please complete your name, email, and phone number first.');
      return;
    }

    setProcessing(true);

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error('Unable to load the payment service. Check your connection and try again.');
      }

      // The server must calculate the amount and create the Razorpay order.
      const order = await createOrder();

      if (!order?.id || !order?.amount || !order?.currency) {
        throw new Error('The server returned an invalid payment order.');
      }

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Digital Heroes PrintForge',
        description,
        order_id: order.id,
        prefill: {
          name: billingDetails.fullName,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },
        notes: {
          billing_city: billingDetails.city || '',
        },
        theme: {
          color: '#C65D35',
        },
        handler: async (paymentResponse) => {
          try {
            // Never treat the browser callback alone as proof of payment.
            // The backend must verify the Razorpay signature.
            const verification = await verifyPayment(paymentResponse);

            if (!verification?.verified && !verification?.success) {
              throw new Error(
                verification?.message || 'Payment verification could not be completed.'
              );
            }

            onSuccess?.({
              ...paymentResponse,
              verification,
            });
          } catch (verificationError) {
            const message =
              verificationError?.message ||
              'Payment was received but could not be verified. Please contact support.';
            setError(message);
            onError?.(verificationError);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            onCancel?.();
          },
          escape: true,
          confirm_close: true,
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on('payment.failed', (response) => {
        const message =
          response?.error?.description ||
          'Payment failed. Please try again.';
        setError(message);
        onError?.(response?.error || new Error(message));
        setProcessing(false);
      });

      checkout.open();
    } catch (paymentError) {
      const message =
        paymentError?.message || 'Something went wrong while starting payment.';
      setError(message);
      onError?.(paymentError);
      setProcessing(false);
    }
  };

  const formattedAmount =
    amount == null
      ? ''
      : new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(Number(amount) || 0);

  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 ${className}`}>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Secure checkout
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
          Payment
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
          Complete your payment securely through Razorpay. Your payment details
          are handled by the payment provider.
        </p>
      </div>

      {formattedAmount && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-[var(--color-surface-soft)] p-4">
          <span className="text-sm text-[var(--color-muted)]">
            Amount payable
          </span>
          <span className="text-lg font-bold text-[var(--color-heading)]">
            {formattedAmount}
          </span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={processing || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {processing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Processing...
          </>
        ) : (
          'Continue to secure payment'
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-muted)]">
        <span aria-hidden="true">🔒</span>
        <span>Secure payment powered by Razorpay</span>
      </div>
    </section>
  );
};

export default PaymentForm;
