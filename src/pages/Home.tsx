import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Star, Users, Package, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ products: 0, sellers: 0, buyers: 0 });
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const load = async () => {
      const [productsRes, categoriesRes, sellersRes, buyersRes, prodCountRes] = await Promise.all([
        supabase.from('products').select('*, seller:profiles(id,full_name,email), category:categories(id,name), reviews(id,rating)').eq('status', 'APPROVED').order('created_at', { ascending: false }).limit(6),
        supabase.from('categories').select('*').limit(6),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'SELLER'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'BUYER'),
        supabase.from('products').select('id', { count: 'exact' }).eq('status', 'APPROVED'),
      ]);
      setFeaturedProducts(productsRes.data ?? []);
      setCategories(categoriesRes.data ?? []);
      setStats({
        sellers: sellersRes.count ?? 0,
        buyers: buyersRes.count ?? 0,
        products: prodCountRes.count ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categoryIcons: Record<string, string> = {
    Handicrafts: '🪡',
    Agriculture: '🌾',
    Textiles: '🧵',
    'Food & Spices': '🌶️',
    Pottery: '🏺',
    Jewelry: '💍',
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-parallax relative bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white overflow-hidden" onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}>
        <div className="absolute inset-0 opacity-20">
          <div className="parallax-layer absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #ff9500 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f7ad1b 0%, transparent 40%)', '--depth': '-20px' } as any} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 parallax-layer" style={{ '--depth': '10px' } as any}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary-200 mb-6 border border-primary-400/30">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Sri Lanka's Rural Marketplace
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Authentic<br />
              <span className="text-primary-400">Rural Craftsmanship</span>
            </h1>
            <p className="text-lg text-dark-300 mb-10 max-w-xl leading-relaxed">
              Connect directly with rural artisans and makers. Buy unique handcrafted products, support local communities, and celebrate Sri Lanka's rich heritage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="btn-premium inline-flex items-center gap-2 bg-primary-500 text-dark-900 font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-primary-900/40 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Browse Marketplace <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                to="/register"
                className="btn-premium inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Package, label: 'Products Listed', value: stats.products, color: 'text-primary-400 bg-primary-900/30' },
              { icon: Users, label: 'Active Sellers', value: stats.sellers, color: 'text-accent-400 bg-accent-900/30' },
              { icon: TrendingUp, label: 'Happy Buyers', value: stats.buyers, color: 'text-primary-300 bg-primary-900/50' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl hover:bg-dark-700 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-white">{value.toLocaleString()}+</div>
                  <div className="text-sm text-dark-400">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
            <p className="text-dark-400 text-sm mt-1">Explore our curated rural product categories</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="card-lift flex flex-col items-center gap-3 p-4 bg-dark-800 rounded-2xl border border-dark-700 hover:border-primary-500 hover:bg-dark-700 group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-3xl floating-icon group-hover:scale-125 transition-transform duration-500">{categoryIcons[cat.name] ?? '🌿'}</span>
              <span className="text-xs font-semibold text-dark-300 text-center leading-tight group-hover:text-primary-300 smooth-transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            <p className="text-dark-400 text-sm mt-1">Handpicked from our finest rural makers</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-dark-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No products yet. Be the first to list!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-dark-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">How RuralConnect Works</h2>
            <p className="text-primary-300 text-sm">Simple, transparent, and community-first</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, step: '01', title: 'Verified Sellers', desc: 'All sellers are verified by our admin team. Products are reviewed before going live.' },
              { icon: Truck, step: '02', title: 'Direct Enquiry', desc: 'Buyers send enquiries directly to sellers. Negotiate and close deals seamlessly.' },
              { icon: Star, step: '03', title: 'Review & Rate', desc: 'After every completed deal, buyers can leave honest reviews to build trust.' },
            ].map(({ icon: Icon, step, title, desc }, idx) => (
              <div key={step} className="card-lift relative p-6 bg-white/5 rounded-2xl border border-primary-900/30 backdrop-blur-sm hover:border-primary-500/50 hover:bg-white/10 group" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="text-5xl font-black text-white/5 absolute top-4 right-4 group-hover:text-white/10 smooth-transition">{step}</div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary-500/50 smooth-transition">
                  <Icon className="w-6 h-6 text-dark-900" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-300 smooth-transition">{title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed group-hover:text-white smooth-transition">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to join RuralConnect?</h2>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">Join thousands of rural makers and buyers creating a better rural economy.</p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn-premium px-6 py-3.5 bg-primary-500 text-dark-900 font-semibold rounded-xl shadow-lg shadow-primary-900/40">
            Create Free Account
          </Link>
          <Link to="/products" className="btn-premium px-6 py-3.5 border border-dark-700 text-dark-300 font-semibold rounded-xl hover:bg-dark-800">
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
}
