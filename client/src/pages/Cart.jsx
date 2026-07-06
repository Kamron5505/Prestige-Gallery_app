import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import useCartStore from '../store/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getDiscount, promoCode, setPromoCode, clearPromoCode } = useCartStore();
  const [promoInput, setPromoInput] = useState('');
  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = getDiscount();

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === 'PRESTIGE10') {
      setPromoCode('PRESTIGE10', 0.1);
      toast.success(t('cart.promoApplied'));
    } else {
      toast.error(t('cart.invalidPromo'));
    }
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    clearPromoCode();
    toast.success(t('cart.promoRemoved'));
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <HiOutlineShoppingBag className="w-16 h-16 text-ivory-300/20 mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-ivory-100 mb-3">{t('cart.emptyTitle')}</h1>
          <p className="text-ivory-300/50 mb-8">{t('cart.emptyDesc')}</p>
          <Link to="/catalog" className="btn-primary">
            {t('cart.browseCollection')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="section-subheading mb-3">{t('cart.subtitle')}</p>
          <h1 className="section-heading">{t('cart.title')}</h1>
          <p className="text-ivory-300/40 text-sm mt-3">{items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-5 pb-6 border-b border-ivory-100/5"
              >
                <Link to={`/catalog/${item.slug}`} className="w-24 h-24 sm:w-28 sm:h-28 bg-charcoal-800 shrink-0 overflow-hidden">
                  <img
                    src={item.image || '/images/flower_1.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link to={`/catalog/${item.slug}`} className="font-serif text-lg text-ivory-100 hover:text-gold transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-ivory-300/40 mt-0.5">
                        {item.price.toLocaleString()} {t('common.so\'m')} {t('cart.each')}
                      </p>
                    </div>
                    <button
                      onClick={() => { removeItem(item._id); toast.success(t('cart.itemRemoved')); }}
                      className="text-ivory-300/30 hover:text-burgundy transition-colors p-1"
                      aria-label={t('cart.remove')}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-ivory-100/10">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-ivory-300/60 hover:text-gold transition-colors"
                      >
                        <HiOutlineMinus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm text-ivory-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-ivory-300/60 hover:text-gold transition-colors"
                      >
                        <HiOutlinePlus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-gold font-medium">
                      {(item.price * item.quantity).toLocaleString()} {t('common.so\'m')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-ivory-300/40 hover:text-gold transition-colors mt-4">
              <HiOutlineArrowLeft className="w-4 h-4" />
              {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-charcoal-800/50 border border-ivory-100/5 p-6 lg:p-8">
              <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40 mb-6">{t('cart.orderSummary')}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ivory-300/60">{t('cart.subtotal')}</span>
                  <span className="text-ivory-100">{subtotal.toLocaleString()} {t('common.so\'m')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gold">{t('cart.discount')} (10%)</span>
                    <span className="text-gold">-{discount.toLocaleString()} {t('common.so\'m')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-ivory-300/60">{t('cart.delivery')}</span>
                  <span className="text-green-400/70">{t('cart.free')}</span>
                </div>
              </div>

              <div className="border-t border-ivory-100/5 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-ivory-100 font-medium">{t('cart.total')}</span>
                  <span className="text-xl text-gold font-medium">{total.toLocaleString()} {t('common.so\'m')}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                {promoCode ? (
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gold/10 border border-gold/20">
                    <span className="text-sm text-gold">{promoCode}</span>
                    <button onClick={handleRemovePromo} className="text-gold/60 hover:text-gold text-xs">
                      {t('cart.removePromo')}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t('cart.promoCode')}
                      className="flex-1 px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                    <button onClick={handleApplyPromo} className="px-4 py-2.5 border border-ivory-100/10 text-sm text-ivory-300/60 hover:text-gold hover:border-gold/30 transition-all">
                      {t('cart.apply')}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full group"
              >
                {t('cart.proceedToCheckout')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
