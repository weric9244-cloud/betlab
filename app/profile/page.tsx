'use client';

import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-primary-light rounded-lg border border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <p className="text-white font-semibold">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <p className="text-white font-semibold">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Balance</label>
            <p className="text-accent-green text-2xl font-bold">
              KES {user.balance.toLocaleString()}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

