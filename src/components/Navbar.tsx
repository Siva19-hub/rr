import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, ShoppingBag, LayoutDashboard, LogOut, CircleUser as UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileOpen(false);
  };

  const dashboardPath =
    profile?.role === 'SELLER' ? '/seller/dashboard'
    : profile?.role === 'BUYER' ? '/buyer/dashboard'
    : profile?.role === 'ADMIN' ? '/admin/dashboard'
    : null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-900 border-b border-primary-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Sprout className="w-5 h-5 text-dark-900" />
            </div>
            <span className="font-bold text-xl text-white">Rural<span className="text-primary-500">Connect</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products') ? 'bg-primary-500 text-dark-900' : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Marketplace
            </Link>
            {user && dashboardPath && (
              <Link
                to={dashboardPath}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith(dashboardPath) ? 'bg-primary-500 text-dark-900' : 'text-dark-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && profile ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 rounded-lg">
                  <UserCircle className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-white font-medium">{profile.full_name.split(' ')[0]}</span>
                  <span className="text-xs bg-primary-500 text-dark-900 px-2 py-0.5 rounded-full font-medium">{profile.role}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-dark-300 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-500 text-dark-900 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-dark-300 hover:bg-dark-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-dark-800 bg-dark-900 px-4 py-3 space-y-1">
          <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-300 hover:bg-dark-800">
            <ShoppingBag className="w-4 h-4" /> Marketplace
          </Link>
          {user && dashboardPath && (
            <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-300 hover:bg-dark-800">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-30">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-center text-sm font-medium border border-dark-700 rounded-lg text-dark-300 hover:bg-dark-800">Sign in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 text-center text-sm font-medium bg-primary-500 text-dark-900 rounded-lg hover:bg-primary-600">Get started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
