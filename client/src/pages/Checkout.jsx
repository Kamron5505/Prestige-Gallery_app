import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, getTotal, getDiscount, promoCode, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const total = getTotal();
  const discount = getDiscount();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || 'Tashkent',
    state: '',
    zip: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'cash',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error(t('checkout.cartEmpty'));
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        customerInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        deliveryAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
        deliveryDate: form.deliveryDate,
        deliveryTime: form.deliveryTime,
        paymentMethod: form.paymentMethod,
        promoCode: promoCode || undefined,
        notes: form.notes,
      };

      const res = await api.post('/orders', orderData);
      clearCart();
      toast.success(t('checkout.orderPlaced'));
      navigate(`/account/orders`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-ivory-300/40 text-lg mb-4">{t('checkout.cartEmpty')}</p>
          <Link to="/catalog" className="btn-outline">{t('cart.browseCollection')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="section-subheading mb-3">{t('checkout.subtitle')}</p>
          <h1 className="section-heading">{t('checkout.title')}</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form Fields */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-5">{t('checkout.contactInfo')}</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('checkout.fullName')}
                    required
                    className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('checkout.email')}
                      required
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t('checkout.phone')}
                      required
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-5">{t('checkout.deliveryDetails')}</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder={t('checkout.streetAddress')}
                    required
                    className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder={t('checkout.city')}
                      required
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder={t('checkout.state')}
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <input
                      type="text"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder={t('checkout.zipCode')}
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="deliveryDate"
                      value={form.deliveryDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50 transition-colors [color-scheme:light]"
                    />
                    <input
                      type="time"
                      name="deliveryTime"
                      value={form.deliveryTime}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50 transition-colors [color-scheme:light]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-5">{t('checkout.paymentMethod')}</h3>
                <div className="space-y-3">
                  {[
                    { value: 'cash', label: t('checkout.cashOnDelivery') },
                    { value: 'card', label: t('checkout.cardPayment') },
                    { value: 'transfer', label: t('checkout.bankTransfer') },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? 'border-gold/50 bg-gold/5'
                          : 'border-ivory-100/10 hover:border-ivory-100/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="text-gold focus:ring-gold/30"
                      />
                      <span className="text-sm text-ivory-100">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-5">{t('checkout.orderNotes')}</h3>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder={t('checkout.notesPlaceholder')}
                  rows={3}
                  className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 bg-charcoal-800/50 border border-ivory-100/5 p-6 lg:p-8">
                <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-6">{t('cart.orderSummary')}</h3>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-charcoal-800 shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ivory-100 truncate">{item.name}</p>
                        <p className="text-xs text-ivory-300/40 mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm text-gold mt-1">{(item.price * item.quantity).toLocaleString()} {t('common.so\'m')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-ivory-100/5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ivory-300/60">{t('cart.subtotal')}</span>
                    <span className="text-ivory-100">{total.toLocaleString()} {t('common.so\'m')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gold">{t('cart.discount')}</span>
                      <span className="text-gold">-{discount.toLocaleString()} {t('common.so\'m')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ivory-300/60">{t('cart.delivery')}</span>
                    <span className="text-green-400/70">{t('cart.free')}</span>
                  </div>
                </div>

                <div className="border-t border-ivory-100/5 pt-4 mt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-ivory-100 font-medium">{t('cart.total')}</span>
                    <span className="text-xl text-gold font-medium">
                      {total.toLocaleString()} {t('common.so\'m')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? t('checkout.processing') : `${t('checkout.placeOrder')} — ${total.toLocaleString()} ${t('common.so\'m')}`}
                </button>

                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 text-sm text-ivory-300/40 hover:text-gold transition-colors mt-4"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  {t('checkout.backToCart')}
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
