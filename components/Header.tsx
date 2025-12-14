'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gray-900 text-white text-center py-2 text-sm">
        <span className="animate-pulse">🔥</span> Free Shipping on Orders Above ₹499 | 
        <a href="https://www.instagram.com/shopsunday.in/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline ml-1">
          Follow us @shopsunday.in
        </a>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-3xl">☀️</span>
              <span>Sunday</span>
            </Link>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
              <div className="flex shadow-lg rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-gray-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 px-6 py-2.5 transition-colors"
                >
                  🔍
                </button>
              </div>
            </form>

            <nav className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/shopsunday.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <Link href="/admin/login" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors">
                Admin
              </Link>
            </nav>
          </div>
          
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 px-6 py-2.5 transition-colors"
              >
                🔍
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
