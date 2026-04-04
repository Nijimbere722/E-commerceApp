import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  shippingAddress: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().optional(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'MOBILE_MONEY', 'CASH_ON_DELIVERY']),
});

type CheckoutForm = z.infer<typeof schema>;

const steps = ['Shipping Info', 'Payment', 'Review'];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CheckoutForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      await api.post('/orders', {
        shippingAddress: data.shippingAddress,
        city: data.city,
        postalCode: data.postalCode,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
      });
    },
    onSuccess: () => {
      toast.success('Order placed successfully!');
      navigate('/orders');
    },
    onError: () => toast.error('Failed to place order'),
  });

  const onSubmit = (data: CheckoutForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h1>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s} className={`text-sm font-medium ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>
            {i + 1}. {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <div>
            <FormInput label="Full Name" name="fullName" register={register} error={errors.fullName?.message} />
            <FormInput label="Shipping Address" name="shippingAddress" register={register} error={errors.shippingAddress?.message} />
            <FormInput label="City" name="city" register={register} error={errors.city?.message} />
            <FormInput label="Postal Code (optional)" name="postalCode" register={register} error={errors.postalCode?.message} />
            <FormInput label="Phone (10 digits)" name="phone" register={register} error={errors.phone?.message} />
            <button type="button" onClick={() => setStep(1)} className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2">
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Method</label>
            <select
              {...register('paymentMethod')}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-2"
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="PAYPAL">PayPal</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-xs">{errors.paymentMethod.message}</p>}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setStep(0)} className="flex-1 border py-2 rounded-lg">Back</button>
              <button type="button" onClick={() => setStep(2)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Review your order</h3>
            <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><strong>Name:</strong> {getValues('fullName')}</p>
              <p><strong>Address:</strong> {getValues('shippingAddress')}, {getValues('city')}</p>
              <p><strong>Phone:</strong> {getValues('phone')}</p>
              <p><strong>Payment:</strong> {getValues('paymentMethod')}</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border py-2 rounded-lg">Back</button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {mutation.isPending ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Checkout;