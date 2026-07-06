import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineChevronRight } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import useAuthStore from '../store/authStore';

const STATUS_STYLES = {
  pending: 'bg-yellow-500/10 text-yellow-400/80',
  confirmed: 'bg-blue-500/10 text-blue-400/80',
  processing: 'bg-purple-500/10 text-purple-400/80',
  delivered: 'bg-green-500/10 text-green-400/80',
  cancelled: 'bg-red-500/10 text-red-400/80',
};

const Orders = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders'),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const orders = data?.data?.orders || [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="section-subheading mb-3">{t('orders.subtitle')}</p>
          <h1 className="section-heading">{t('orders.title')}</h1>
          <p className="text-ivory-300/40 text-sm mt-3">{orders.length} {orders.length === 1 ? t('orders.order') : t('orders.orders')}</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-charcoal-800/30 border border-ivory-100/5 p-6 animate-pulse">
                <div className="h-4 bg-charcoal-800 rounded w-1/4 mb-3" />
                <div className="h-3 bg-charcoal-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineShoppingBag className="w-16 h-16 text-ivory-300/20 mx-auto mb-6" />
            <p className="text-ivory-300/40 text-lg mb-2">{t('orders.emptyTitle')}</p>
            <p className="text-ivory-300/30 text-sm mb-8">{t('orders.emptyDesc')}</p>
            <Link to="/catalog" className="btn-outline">{t('cart.browseCollection')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-charcoal-800/30 border border-ivory-100/5 p-6 lg:p-8 hover:border-ivory-100/10 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-serif text-lg text-ivory-100">{order.orderNumber}</span>
                      <span className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 font-medium ${STATUS_STYLES[order.status] || 'text-ivory-300/40'}`}>
                        {t(`orders.status.${order.status}`, order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-ivory-300/40">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' — '}
                      {order.items?.length || 0} {order.items?.length === 1 ? t('orders.item') : t('orders.items')}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-gold font-medium">{order.total?.toLocaleString()} {t('common.so\'m')}</p>
                      <p className="text-xs text-ivory-300/30 capitalize">{order.paymentMethod}</p>
                    </div>
                    <Link
                      to={`/account/orders`}
                      className="text-ivory-300/30 hover:text-gold transition-colors"
                    >
                      <HiOutlineChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Order items preview */}
                {order.items?.length > 0 && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-ivory-100/5">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-12 h-12 bg-charcoal-800 overflow-hidden">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-charcoal-800 flex items-center justify-center text-xs text-ivory-300/40">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
