'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useBetslip } from '@/contexts/BetslipContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  FiHome, 
  FiUser, 
  FiLogOut, 
  FiDollarSign, 
  FiList,
  FiBell,
  FiSearch,
  FiMenu
} from 'react-icons/fi';
import { 
  FaFutbol, 
  FaBasketballBall, 
  FaVolleyballBall,
  FaTableTennis,
  FaHockeyPuck
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { betslip } = useBetslip();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('Soccer');

  const sports = [
    { name: 'Soccer', icon: FaFutbol },
    { name: 'Basketball', icon: FaBasketballBall },
    { name: 'Volleyball', icon: FaVolleyballBall },
    { name: 'Table Tennis', icon: FaTableTennis },
    { name: 'Ice Hockey', icon: FaHockeyPuck },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <header className="bg-primary-darker border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white p-2"
              >
                <FiMenu size={24} />
              </button>
              <Link href="/dashboard" className="text-2xl font-bold text-accent-yellow">
                Betlab
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/dashboard" className="text-white hover:text-accent-green transition">
                Home
              </Link>
              <Link href="/dashboard?status=live" className="text-white hover:text-accent-green transition">
                Live
              </Link>
              <Link href="/jackpots" className="text-white hover:text-accent-green transition">
                Jackpots
              </Link>
              <Link href="/sportsbook" className="text-white hover:text-accent-green transition">
                Sportsbook
              </Link>
              <Link href="/casino" className="text-white hover:text-accent-green transition">
                Casino
              </Link>
              <Link href="/my-bets" className="text-white hover:text-accent-green transition">
                My Bets
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-accent-green transition">
                <FiBell size={20} />
              </button>
              <Link href="/my-bets" className="text-white hover:text-accent-green transition relative">
                <FiList size={20} />
                {betslip.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {betslip.length}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-white hover:text-accent-green transition">
                <FiUser size={20} />
              </Link>
              <Link
                href="/deposit"
                className="bg-accent-yellow text-primary-dark px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
              >
                Deposit
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-primary-darker border-r border-gray-800 z-40 transition-transform duration-300 pt-20 lg:pt-0`}
        >
          <div className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 p-3 rounded hover:bg-primary-light transition text-gray-300"
            >
              <FiHome size={20} />
              <span>Home</span>
            </Link>

            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-gray-500 text-sm uppercase px-3 mb-2">Sports</h3>
              {sports.map((sport) => {
                const Icon = sport.icon;
                const isSelected = selectedSport === sport.name;
                return (
                  <Link
                    key={sport.name}
                    href={`/sportsbook?sport=${sport.name}`}
                    onClick={() => setSelectedSport(sport.name)}
                    className={`w-full flex items-center space-x-3 p-3 rounded transition ${
                      isSelected
                        ? 'bg-accent-green text-white'
                        : 'text-gray-300 hover:bg-primary-light'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{sport.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-20">
          {children}
        </main>

        {/* Floating Betslip Indicator */}
        {betslip.length > 0 && (
          <Link
            href="/betting"
            className="fixed bottom-4 right-4 bg-accent-green hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition z-50 flex items-center space-x-2"
          >
            <span>Betslip ({betslip.length})</span>
          </Link>
        )}

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

