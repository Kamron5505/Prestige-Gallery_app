import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineStar } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const discount = product.discountPercentage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(t('product.addedToCart'));
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('product.pleaseSignIn'));
      return;
    }
    try {
      await api.post(`/favorites/${product._id}`);
      toast.success(t('product.addedToFavorites'));
    } catch {
      toast.error('Failed to add to favorites');
    }
  };

  return (
    <Link
      to={`/catalog/${product.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-charcoal-800 aspect-[3/4] mb-4 rounded-sm">
        <img
          src={product.images?.[0]?.url || '/images/flower_1.jpg'}
          alt={product.images?.[0]?.alt || product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[2deg]"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-6">
          <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={handleAddToCart}
              className="w-11 h-11 bg-gold text-charcoal-900 flex items-center justify-center hover:bg-gold-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-gold/20"
              aria-label={t('product.addToCart')}
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="w-11 h-11 bg-white/15 backdrop-blur-sm text-ivory-100 flex items-center justify-center hover:bg-rose/80 hover:text-ivory-100 transition-all duration-300 hover:scale-105 border border-white/10"
              aria-label={t('product.addToFavorites')}
            >
              <HiOutlineHeart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <span className="bg-burgundy text-ivory-100 text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 font-medium shadow-lg">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="bg-gold text-charcoal-900 text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 font-medium shadow-lg">
              {t('common.new')}
            </span>
          )}
          {product.isPremium && (
            <span className="bg-charcoal-900/60 backdrop-blur-sm text-gold text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 border border-gold/30 shadow-lg">
              Premium
            </span>
          )}
        </div>

        {/* Rating badge */}
        {product.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-charcoal-900/60 backdrop-blur-sm px-2 py-1 shadow-lg">
            <HiOutlineStar className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[10px] text-ivory-100 font-medium">{product.rating}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 px-0.5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ivory-300/40 font-medium">
          {product.category?.name || t('common.flowers')}
        </p>
        <h3 className="font-elegant text-lg text-ivory-100 group-hover:text-gold transition-colors duration-300 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-1">
          {product.discountPrice ? (
            <>
              <span className="text-gold font-semibold text-base">
                {product.discountPrice.toLocaleString()} {t('common.so\'m')}
              </span>
              <span className="text-ivory-300/25 text-sm line-through">
                {product.price.toLocaleString()} {t('common.so\'m')}
              </span>
            </>
          ) : (
            <span className="text-ivory-100/90 font-medium text-base">
              {product.price.toLocaleString()} {t('common.so\'m')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
