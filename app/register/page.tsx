'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const countryCodes = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
];

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+254');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(phone, countryCode, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-darker to-primary-dark">
      <div className="w-full max-w-md p-8 bg-primary-light rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent-yellow mb-2">Betlab</h1>
          <p className="text-gray-400">Create your account to start betting</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="flex">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountrySelect(!showCountrySelect)}
                  className="px-3 py-3 bg-primary-darker border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-white flex items-center space-x-2"
                >
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <span className="text-gray-400">▼</span>
                </button>
                {showCountrySelect && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-primary-darker border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {countryCodes.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setCountryCode(country.code);
                          setShowCountrySelect(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-primary-light flex items-center space-x-2 text-white"
                      >
                        <span>{country.flag}</span>
                        <span>{country.country}</span>
                        <span className="text-gray-400 ml-auto">{country.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
                className="flex-1 px-4 py-3 bg-primary-darker border border-gray-700 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-white"
                placeholder="712345678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-primary-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-primary-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-white"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-primary-darker border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green text-white"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-green hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-green hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
