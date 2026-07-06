import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/favorites'),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const favorites = data?.data?.favorites || [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="section-subheading mb-3">{t('favorites.subtitle')}</p>
          <h1 className="section-heading">{t('favorites.title')}</h1>
          <p className="text-ivory-300/40 text-sm mt-3">{favorites.length} {favorites.length === 1 ? t('favorites.item') : t('favorites.items')}</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-charcoal-800 aspect-[3/4] mb-4" />
                <div className="h-3 bg-charcoal-800 rounded w-1/3 mb-2" />
                <div className="h-4 bg-charcoal-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineHeart className="w-16 h-16 text-ivory-300/20 mx-auto mb-6" />
            <p className="text-ivory-300/40 text-lg mb-2">{t('favorites.emptyTitle')}</p>
            <p className="text-ivory-300/30 text-sm mb-8">{t('favorites.emptyDesc')}</p>
            <Link to="/catalog" className="btn-outline">{t('cart.browseCollection')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {favorites.map((fav) => (
              <motion.div
                key={fav._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProductCard product={fav.product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
