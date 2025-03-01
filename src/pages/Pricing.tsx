import { useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS, PREMIUM_FEATURES } from '../utils/premium';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const handleSelectPlan = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;
    
    navigate('/payment-methods', { 
      state: { 
        plan,
        amount: plan.price,
        currency: 'USD',
        description: `${plan.name} subscription (${billingInterval === 'month' ? 'Monthly' : 'Yearly'})`
      } 
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose a plan that works best for your farm
          </p>
        </div>

        <div className="mt-12 sm:mt-16 sm:flex sm:justify-center">
          <div className="relative bg-white rounded-lg shadow-sm p-0.5 flex">
            <button
              type="button"
              className={`${
                billingInterval === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              } relative w-1/2 py-2 px-6 text-sm font-medium rounded-md focus:outline-none transition-colors`}
              onClick={() => setBillingInterval('month')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${
                billingInterval === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              } relative w-1/2 py-2 px-6 text-sm font-medium rounded-md focus:outline-none transition-colors`}
              onClick={() => setBillingInterval('year')}
            >
              Yearly <span className="text-blue-300 text-xs">(Save 16%)</span>
            </button>
          </div>
        </div>

        <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="border border-gray-200 bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900">Free</h2>
              <p className="mt-4 text-gray-500">Basic features for small farms just getting started.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-base font-medium text-gray-500">/forever</span>
              </p>
              <button
                disabled={true}
                className="mt-8 block w-full bg-blue-50 border border-blue-500 rounded-md py-2 text-sm font-semibold text-blue-600 text-center"
              >
                {user?.subscription === 'free' ? 'Current Plan' : 'Free Plan'}
              </button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                What's included
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Dashboard overview</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Basic flock management</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Limited to 2 flocks</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Basic production tracking</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border border-blue-500 bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900">Premium</h2>
              <p className="mt-4 text-gray-500">Advanced features for growing poultry farms.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingInterval === 'month' ? '9.99' : '99.99'}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /{billingInterval === 'month' ? 'month' : 'year'}
                </span>
              </p>
              <button
                onClick={() => handleSelectPlan(billingInterval === 'month' ? 'premium_monthly' : 'premium_yearly')}
                className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700"
              >
                {user?.subscription === 'premium' ? 'Current Plan' : 'Get Premium'}
              </button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                What's included
              </h3>
              <ul className="mt-6 space-y-4">
                {PREMIUM_FEATURES
                  .filter(feature => feature.tier === 'premium')
                  .map(feature => (
                    <li key={feature.id} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-sm text-gray-500">{feature.description}</span>
                    </li>
                  ))}
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Everything in Free plan</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-gray-200 bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900">Enterprise</h2>
              <p className="mt-4 text-gray-500">Advanced features for large commercial operations.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$24.99</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSelectPlan('enterprise')}
                className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700"
              >
                {user?.subscription === 'enterprise' ? 'Current Plan' : 'Get Enterprise'}
              </button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                What's included
              </h3>
              <ul className="mt-6 space-y-4">
                {PREMIUM_FEATURES
                  .filter(feature => feature.tier === 'enterprise')
                  .map(feature => (
                    <li key={feature.id} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-sm text-gray-500">{feature.description}</span>
                    </li>
                  ))}
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  <span className="text-sm text-gray-500">Everything in Premium plan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
