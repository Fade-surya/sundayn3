'use client';

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
              🎉 New Arrivals Every Week
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Shop the Best Deals on 
              <span className="block text-yellow-200">Trending Products</span>
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Discover amazing products at unbeatable prices. Quality you can trust, prices you'll love.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/shopsunday.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Shop on Instagram
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Browse Products
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">☀️</div>
                  <div className="text-2xl font-bold">Sunday</div>
                  <div className="text-sm text-white/80">Shop Happy</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
                Up to 70% OFF
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💯</span>
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔄</span>
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💳</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
