import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowLeft, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineArrowPath } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`),
    enabled: !!slug,
  });

  const product = productData?.data?.product;
  const discount = product?.discountPercentage;

  const { data: relatedData } = useQuery({
    queryKey: ['related', product?._id],
    queryFn: () => api.get(`/products/${product._id}/related`),
    enabled: !!product?._id,
  });

  const relatedProducts = relatedData?.data?.products || [];

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} ${t('product.addedToCart')}`);
  };

  const handleToggleFavorite = async () => {
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

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 animate-pulse">
            <div className="bg-charcoal-800 aspect-[4/5]" />
            <div className="space-y-4">
              <div className="h-4 bg-charcoal-800 rounded w-1/4" />
              <div className="h-8 bg-charcoal-800 rounded w-3/4" />
              <div className="h-6 bg-charcoal-800 rounded w-1/3" />
              <div className="h-24 bg-charcoal-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-ivory-300/40 text-lg mb-4">Product not found</p>
          <Link to="/catalog" className="btn-outline">
            {t('product.backToCatalog')}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: '/images/flower_1.jpg' }];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-ivory-300/40 hover:text-gold transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4" />
            {t('product.backToCatalog')}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden bg-charcoal-800 aspect-[4/5] mb-4">
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              {discount && (
                <span className="absolute top-4 left-4 bg-burgundy text-ivory-100 text-xs uppercase tracking-[0.15em] px-3 py-1.5 font-medium">
                  -{discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-gold' : 'border-transparent hover:border-ivory-100/20'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-3">
              {product.category?.name || t('common.flowers')}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-ivory-100 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl text-gold font-medium">
                    {product.discountPrice.toLocaleString()} {t('common.so\'m')}
                  </span>
                  <span className="text-lg text-ivory-300/30 line-through">
                    {product.price.toLocaleString()} {t('common.so\'m')}
                  </span>
                </>
              ) : (
                <span className="text-3xl text-ivory-100 font-medium">
                  {product.price.toLocaleString()} {t('common.so\'m')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-ivory-300/60 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Details */}
            <div className="space-y-3 mb-8 border-t border-ivory-100/5 pt-8">
              {product.composition && (
                <div className="flex gap-2">
                  <span className="text-sm text-ivory-300/40 w-28 shrink-0">{t('product.composition')}</span>
                  <span className="text-sm text-ivory-300/60">{product.composition}</span>
                </div>
              )}
              {product.size && (
                <div className="flex gap-2">
                  <span className="text-sm text-ivory-300/40 w-28 shrink-0">{t('product.size')}</span>
                  <span className="text-sm text-ivory-300/60">{product.size}</span>
                </div>
              )}
              {product.tags?.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-sm text-ivory-300/40 w-28 shrink-0">{t('product.tags')}</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-charcoal-800 text-ivory-300/50 uppercase tracking-[0.1em]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="flex gap-2">
                  <span className="text-sm text-ivory-300/40 w-28 shrink-0">{t('product.availability')}</span>
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-400/70' : 'text-burgundy'}`}>
                    {product.stock > 0 ? `${t('product.inStock')} (${product.stock} ${t('product.available')})` : t('product.outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-ivory-100/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-ivory-300/60 hover:text-gold transition-colors"
                  >
                    <HiOutlineMinus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center text-ivory-100 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-ivory-300/60 hover:text-gold transition-colors"
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="btn-primary flex-1 group">
                  <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
                  {t('product.addToCart')}
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className="w-12 h-12 border border-ivory-100/10 flex items-center justify-center text-ivory-300/60 hover:text-rose hover:border-rose/30 transition-all"
                >
                  <HiOutlineHeart className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Shipping info */}
            <div className="border-t border-ivory-100/5 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-ivory-300/50">
                <HiOutlineTruck className="w-4 h-4 text-gold/60" />
                {t('common.freeDelivery')}
              </div>
              <div className="flex items-center gap-3 text-sm text-ivory-300/50">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold/60" />
                {t('common.freshnessGuaranteed')}
              </div>
              <div className="flex items-center gap-3 text-sm text-ivory-300/50">
                <HiOutlineArrowPath className="w-4 h-4 text-gold/60" />
                {t('common.easyReturns')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-ivory-100/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="section-subheading mb-3">{t('product.youMayAlsoLike')}</p>
              <h2 className="section-heading">{t('product.completeYourExperience')}</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
