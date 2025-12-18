import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

// Your Stripe Publishable Key
const stripePromise = loadStripe('pk_test_51SfSph1Dp9Ze03lMlKdcBF6AWvkEwc63z0yiJB09OoDFjKbMvNa5K9llb6If7IHQ3qQnE0SI9c8nZ8iZVKl31TvL00cmLnIMAi');

function CheckoutForm({ amount, orderData, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const response = await fetch('http://localhost:5000/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    orderNumber: 'FL' + Date.now(),
                    customerEmail: orderData.email,
                    customerName: orderData.name
                })
            });

            const { clientSecret } = await response.json();

            // Confirm payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: orderData.name,
                        email: orderData.email
                    }
                }
            });

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
            } else if (paymentIntent.status === 'succeeded') {
                setSuccess(true);
                setProcessing(false);
                if (onSuccess) {
                    onSuccess(paymentIntent);
                }
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your shipment has been confirmed.</p>
                <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CreditCard className="inline h-4 w-4 mr-2" />
                    Card Details
                </label>
                <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-orange-500 transition">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#374151',
                                    '::placeholder': {
                                        color: '#9CA3AF',
                                    },
                                },
                                invalid: {
                                    color: '#EF4444',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-900 text-sm mb-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-semibold">Secure Payment</span>
                </div>
                <p className="text-blue-700 text-xs">
                    Your payment information is encrypted and secure. We never store your card details.
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">${amount.toFixed(2)}</p>
                </div>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay $${amount.toFixed(2)}`
                    )}
                </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
                Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
            </p>
        </form>
    );
}

export default function PaymentForm({ amount, orderData, onSuccess }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} orderData={orderData} onSuccess={onSuccess} />
        </Elements>
    );
}