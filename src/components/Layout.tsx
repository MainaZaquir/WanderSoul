import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hop as Home, MapPin, ShoppingBag, Users, Award, Mail, LogOut, Menu, X, Bell, Search, Settings, ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { UserProfileModal } from './UserProfileModal';
import { CartModal } from './CartModal';
import { Logo } from './Logo';
import { logUserAction } from '../lib/errorLogger';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const navigation = useMemo(() => [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trips', href: '/trips', icon: MapPin },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Sponsorship', href: '/sponsorship', icon: Award },
  ], []);

  const totalCartItems = useMemo(() => getTotalItems(), [getTotalItems]);

  const handleSignOut = useCallback(async () => {
    logUserAction('user_logout');
    await signOut();
    setMobileMenuOpen(false);
  }, [signOut]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
  }, []);

  const handleCartClick = useCallback(() => {
    setShowCartModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Logo height={50} className="hidden sm:block" />
                <Logo height={40} className="sm:hidden" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">Muchina Malomba</span>
                <div className="text-xs text-gray-500 font-medium">Adventure Curator</div>
              </div>
            </Link>

            <div className="lg:hidden flex items-center gap-2">
              <button
                  onClick={handleCartClick}
                  className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                >
                  <ShoppingCart size={22} />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {totalCartItems}
                    </span>
                  )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link flex items-center space-x-2 ${
                      isActive
                        ? 'text-orange-600 bg-orange-50 active'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300"
            >
              <ShoppingCart size={20} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {totalCartItems}
                </span>
              )}
            </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile */}
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfileModal(true);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{profile?.full_name || 'Profile'}</span>
                  </Link>

                  {/* Admin Dashboard Link */}
                  {profile?.is_admin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                    >
                      <Settings size={18} />
                      <span className="text-sm">Admin Dashboard</span>
                    </Link>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/auth"
                    className="btn-outline"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="btn-primary"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white p-4 animate-slide-up">
            <div className="max-w-7xl mx-auto container-padding">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search trips, destinations, or experiences..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-up">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </form>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-1">
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfileModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{profile?.full_name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 w-full text-left rounded-xl transition-all duration-300"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 font-medium rounded-lg transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-center shadow-md"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Logo height={48} className="brightness-0 invert" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Travel With Muchina</h3>
                  <p className="text-gray-400 text-sm">Adventure Curator & Radio Host</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Explore Kenya and beyond with authentic adventures curated by radio host and travel enthusiast Muchina Malomba.
              </p>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <Award size={16} />
                <span className="font-semibold text-sm">Lifestyle Influencer of the Year Nominee</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gradient">Quick Links</h4>
              <nav className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gradient">Contact</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3 hover:text-orange-400 transition-colors duration-300">
                  <Mail size={16} />
                  <span>muchinabrian@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Available for partnerships</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Travel With Muchina. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Built and Powered by <span className="text-gradient font-semibold">CoreDigital</span>
            </p>
          </div>
        </div>
      </footer>

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          onClose={() => setShowProfileModal(false)}
          onSuccess={() => setShowProfileModal(false)}
        />
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal
          onClose={() => setShowCartModal(false)}
        />
      )}
    </div>
  );
}