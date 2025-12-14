'use client';

import Image from 'next/image';
import Link from 'next/link';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <span className="text-5xl">📦</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              {discount}% OFF
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              🔥 Hot
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full font-medium text-sm">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-xs text-green-600 font-medium">
              You save ₹{(product.original_price! - product.price).toLocaleString()}
            </p>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-600 mt-1 font-medium">
              ⚡ Only {product.stock} left!
            </p>
          )}
        </div>
      </Link>
      {product.instagram_link && (
        <div className="px-4 pb-4 pt-0">
          <a
            href={product.instagram_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
            View on Instagram
          </a>
        </div>
      )}
    </div>
  );
}
