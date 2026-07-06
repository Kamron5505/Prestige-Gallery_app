import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '0',
    tags: '',
    isPremium: false,
    isNew: false,
    isGift: false,
    composition: '',
    size: '',
  });

  const TABS = [
    { id: 'products', label: t('admin.products') },
    { id: 'orders', label: t('admin.orders') },
    { id: 'categories', label: t('admin.categories') },
  ];

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products?limit=50'),
    enabled: activeTab === 'products',
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders'),
    enabled: activeTab === 'orders',
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/categories'),
  });

  const products = productsData?.data?.products || [];
  const orders = ordersData?.data?.orders || [];
  const categories = categoriesData?.data?.categories || [];

  const resetForm = () => {
    setProductForm({
      name: '', description: '', price: '', discountPrice: '', category: '',
      stock: '0', tags: '', isPremium: false, isNew: false, isGift: false,
      composition: '', size: '',
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : undefined,
        stock: parseInt(productForm.stock),
        tags: productForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success(t('admin.productUpdated'));
      } else {
        await api.post('/products', payload);
        toast.success(t('admin.productCreated'));
      }
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success(t('admin.productDeleted'));
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (err) {
      toast.error(err.message || 'Failed to update order');
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="section-subheading mb-3">{t('admin.subtitle')}</p>
          <h1 className="section-heading">{t('admin.title')}</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-ivory-100/5 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                activeTab === tab.id
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-ivory-300/40 hover:text-ivory-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-ivory-300/40">{products.length} {t('admin.products')}</p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-outline text-xs flex items-center gap-2"
              >
                <HiOutlinePlus className="w-4 h-4" />
                {showAddForm ? t('admin.cancel') : t('admin.addProduct')}
              </button>
            </div>

            {/* Product Form */}
            {showAddForm && (
              <form onSubmit={handleProductSubmit} className="bg-charcoal-800/30 border border-ivory-100/5 p-6 mb-8 space-y-4">
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-4">
                  {editingProduct ? t('admin.editProduct') : t('admin.newProduct')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder={t('admin.productName')} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50" />
                  <input name="price" type="number" placeholder={t('admin.price')} value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50" />
                  <input name="discountPrice" type="number" placeholder={t('admin.discountPrice')} value={productForm.discountPrice} onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })} className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50" />
                  <input name="stock" type="number" placeholder={t('admin.stock')} value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50" />
                  <select name="category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50">
                    <option value="">{t('admin.selectCategory')}</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <input name="tags" placeholder={t('admin.tags')} value={productForm.tags} onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })} className="px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50" />
                  <div className="md:col-span-2">
                    <textarea name="description" placeholder={t('admin.description')} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows={3} className="w-full px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50 resize-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-ivory-300/60">
                      <input type="checkbox" checked={productForm.isPremium} onChange={(e) => setProductForm({ ...productForm, isPremium: e.target.checked })} className="rounded" />
                      {t('catalog.premium')}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ivory-300/60">
                      <input type="checkbox" checked={productForm.isNew} onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })} className="rounded" />
                      {t('catalog.newArrivals')}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ivory-300/60">
                      <input type="checkbox" checked={productForm.isGift} onChange={(e) => setProductForm({ ...productForm, isGift: e.target.checked })} className="rounded" />
                      {t('catalog.giftIdeas')}
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-primary text-sm">
                  {editingProduct ? t('admin.updateProduct') : t('admin.createProduct')}
                </button>
              </form>
            )}

            {/* Products Table */}
            {productsLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-charcoal-800 rounded" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ivory-100/5">
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs">{t('admin.product')}</th>
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs hidden md:table-cell">{t('admin.price')}</th>
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs hidden md:table-cell">{t('admin.stock')}</th>
                      <th className="text-right py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-ivory-100/5 hover:bg-ivory-100/[0.02]">
                        <td className="py-3 px-4">
                          <p className="text-ivory-100">{product.name}</p>
                          <p className="text-xs text-ivory-300/30">{product.category?.name}</p>
                        </td>
                        <td className="py-3 px-4 text-ivory-300/60 hidden md:table-cell">
                          {product.discountPrice || product.price} {t('common.so\'m')}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className={`text-xs ${product.stock > 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-ivory-300/40 hover:text-gold transition-colors" title={t('account.edit')}>
                              <HiOutlinePencilSquare className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 text-ivory-300/40 hover:text-red-400 transition-colors" title="Delete">
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-charcoal-800 rounded" />)}
              </div>
            ) : orders.length === 0 ? (
              <p className="text-ivory-300/40 text-center py-10">{t('admin.noOrders')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ivory-100/5">
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs">{t('admin.product')}</th>
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs hidden md:table-cell">{t('admin.customer')}</th>
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs hidden md:table-cell">{t('admin.total')}</th>
                      <th className="text-left py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs">{t('admin.status')}</th>
                      <th className="text-right py-3 px-4 text-ivory-300/40 font-normal uppercase tracking-[0.1em] text-xs">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-ivory-100/5 hover:bg-ivory-100/[0.02]">
                        <td className="py-3 px-4">
                          <p className="text-ivory-100 text-xs font-mono">{order.orderNumber}</p>
                          <p className="text-xs text-ivory-300/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4 text-ivory-300/60 hidden md:table-cell">
                          <p>{order.customerInfo?.name}</p>
                          <p className="text-xs text-ivory-300/30">{order.customerInfo?.email}</p>
                        </td>
                        <td className="py-3 px-4 text-gold hidden md:table-cell">{order.total?.toLocaleString()} {t('common.so\'m')}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 ${
                            order.status === 'delivered' ? 'bg-green-500/10 text-green-400/80' :
                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-400/80' :
                            order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400/80' :
                            'bg-yellow-500/10 text-yellow-400/80'
                          }`}>
                            {t(`orders.status.${order.status}`, order.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="text-xs bg-charcoal-800 border border-ivory-100/10 text-ivory-100 px-2 py-1 focus:outline-none focus:border-gold/50 cursor-pointer"
                          >
                            <option value="pending">{t('orders.status.pending')}</option>
                            <option value="confirmed">{t('orders.status.confirmed')}</option>
                            <option value="processing">{t('orders.status.processing')}</option>
                            <option value="delivered">{t('orders.status.delivered')}</option>
                            <option value="cancelled">{t('orders.status.cancelled')}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <p className="text-sm text-ivory-300/40 mb-6">{categories.length} {t('admin.categoriesCount')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-charcoal-800/30 border border-ivory-100/5 p-5">
                  <h3 className="font-serif text-lg text-ivory-100 mb-1">{cat.name}</h3>
                  <p className="text-xs text-ivory-300/40">{cat.slug}</p>
                  {cat.description && (
                    <p className="text-sm text-ivory-300/60 mt-2">{cat.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
