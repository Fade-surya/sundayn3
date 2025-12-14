'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Admin {
  id: string;
  email: string;
  name: string;
  is_super_admin: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  stock: number;
  is_active: boolean;
  instagram_link?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'admins'>('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    category: '',
    stock: '',
    instagramLink: '',
    isActive: true,
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
      fetchProducts();
      if (data.admin.is_super_admin) {
        fetchAdmins();
      }
    } catch {
      router.push('/admin/login');
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        originalPrice: product.original_price?.toString() || '',
        imageUrl: product.image_url || '',
        category: product.category || '',
        stock: product.stock.toString(),
        instagramLink: product.instagram_link || '',
        isActive: product.is_active,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        category: '',
        stock: '',
        instagramLink: '',
        isActive: true,
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
          imageUrl: productForm.imageUrl || null,
          category: productForm.category || null,
          stock: parseInt(productForm.stock) || 0,
          instagramLink: productForm.instagramLink || null,
          isActive: productForm.isActive,
        }),
      });

      if (res.ok) {
        setShowProductModal(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });

      if (res.ok) {
        setShowAdminModal(false);
        setAdminForm({ email: '', password: '', name: '' });
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Failed to add admin:', error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    try {
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span>☀️</span> Sunday
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {admin?.name || admin?.email}
              {admin?.is_super_admin && (
                <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                  Super Admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Products
          </button>
          {admin?.is_super_admin && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'admins'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Manage Admins
            </button>
          )}
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products ({products.length})</h2>
              <button
                onClick={() => openProductModal()}
                className="btn-primary"
              >
                + Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              📦
                            </div>
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.category || '-'}</td>
                      <td className="px-4 py-3">₹{product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            product.is_active
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openProductModal(product)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No products yet. Add your first product!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admins' && admin?.is_super_admin && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admins ({admins.length})</h2>
              <button
                onClick={() => setShowAdminModal(true)}
                className="btn-primary"
              >
                + Add Admin
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {admins.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{a.name || '-'}</td>
                      <td className="px-4 py-3">{a.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            a.is_super_admin
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {a.is_super_admin ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!a.is_super_admin && (
                          <button
                            onClick={() => handleDeleteAdmin(a.id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram Link</label>
                  <input
                    type="url"
                    value={productForm.instagramLink}
                    onChange={(e) => setProductForm({ ...productForm, instagramLink: e.target.value })}
                    className="input-field"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="text-sm">Active (visible to customers)</label>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Add New Admin</h3>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Add Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
