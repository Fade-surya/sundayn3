'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  stock: number;
  instagram_link?: string;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">This product may have been removed or doesn't exist.</p>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square bg-gray-50">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                  <span className="text-9xl">📦</span>
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="p-8 md:p-10">
              {product.category && (
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {product.category}
                </span>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>

              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              
              {discount > 0 && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-block mb-6">
                  <span className="font-medium">You save ₹{(product.original_price! - product.price).toLocaleString()}</span>
                </div>
              )}

              <div className="mb-6">
                {product.stock > 10 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                    <span className="font-medium">Only {product.stock} left - Order soon!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {product.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About this product</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              <div className="space-y-3">
                {product.instagram_link && (
                  <a
                    href={product.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                    </svg>
                    View & Buy on Instagram
                  </a>
                )}
                
                <a
                  href="https://www.instagram.com/shopsunday.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Contact us on Instagram to order
                </a>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-gray-600">Free Shipping</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">💯</div>
                    <div className="text-gray-600">Quality Assured</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🔄</div>
                    <div className="text-gray-600">Easy Returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
