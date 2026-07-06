import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const SORT_OPTIONS = [
    { label: t('catalog.newest'), value: 'newest' },
    { label: t('catalog.priceLowHigh'), value: 'price_asc' },
    { label: t('catalog.priceHighLow'), value: 'price_desc' },
    { label: t('catalog.mostPopular'), value: 'popular' },
  ];

  const FILTER_OPTIONS = [
    { label: t('catalog.premium'), key: 'premium', value: 'true' },
    { label: t('catalog.newArrivals'), key: 'new', value: 'true' },
    { label: t('catalog.giftIdeas'), key: 'gift', value: 'true' },
  ];

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const premium = searchParams.get('premium') || '';
  const isNew = searchParams.get('new') || '';
  const gift = searchParams.get('gift') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef(null);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories'),
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { category, sort, premium, isNew: isNew, gift, page, search, minPrice, maxPrice }],
    queryFn: () =>
      api.get(
        `/products?page=${page}&limit=12&sort=${sort}${
          category ? `&category=${category}` : ''
        }${premium ? '&premium=true' : ''}${isNew ? '&new=true' : ''}${gift ? '&gift=true' : ''}${
          search ? `&search=${search}` : ''
        }${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`
      ),
  });

  const categories = categoriesData?.data?.categories || [];
  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination || { page: 1, pages: 1, total: 0 };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = category || premium || isNew || gift || search || minPrice || maxPrice;

  // Debounced handlers — defined after updateFilter to avoid stale closures
  const handleSearchChange = (value) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter('search', value);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    updateFilter('search', '');
  };

  // Price range presets
  const PRICE_PRESETS = [
    { label: t('catalog.all'), min: '', max: '' },
    { label: t('catalog.under'), min: '', max: '200000' },
    { label: t('catalog.mid'), min: '200000', max: '400000' },
    { label: t('catalog.premium'), min: '400000', max: '' },
  ];

  const currentPricePreset = PRICE_PRESETS.findIndex(
    (p) => p.min === minPrice && p.max === maxPrice
  );

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-subheading mb-3">{t('catalog.subtitle')}</p>
          <h1 className="section-heading">{t('catalog.title')}</h1>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Search with icon + clear */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('catalog.search')}</h4>
                <div className="relative">
                  <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-300/30" />
                  <input
                    type="text"
                    placeholder={t('catalog.search')}
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  {searchInput && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory-300/30 hover:text-gold transition-colors"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('catalog.categories')}</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`block w-full text-left text-sm py-1.5 transition-colors ${
                      !category ? 'text-gold' : 'text-ivory-300/60 hover:text-ivory-100'
                    }`}
                  >
                    {t('catalog.all')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', cat._id)}
                      className={`block w-full text-left text-sm py-1.5 transition-colors ${
                        category === cat._id ? 'text-gold' : 'text-ivory-300/60 hover:text-ivory-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('catalog.price')}</h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        if (preset.min) params.set('minPrice', preset.min);
                        else params.delete('minPrice');
                        if (preset.max) params.set('maxPrice', preset.max);
                        else params.delete('maxPrice');
                        params.set('page', '1');
                        setSearchParams(params);
                      }}
                      className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                        currentPricePreset === i
                          ? 'bg-gold text-charcoal-900 font-medium'
                          : 'border border-ivory-100/10 text-ivory-300/50 hover:border-gold/30 hover:text-gold'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('catalog.filters')}</h4>
                <div className="space-y-2">
                  {FILTER_OPTIONS.map((opt) => {
                    const isActive = searchParams.get(opt.key) === opt.value;
                    return (
                      <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => updateFilter(opt.key, isActive ? '' : opt.value)}
                          className="w-4 h-4 bg-charcoal-800 border border-ivory-100/20 rounded checked:bg-gold checked:border-gold focus:ring-gold/30 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className={`text-sm transition-colors ${isActive ? 'text-gold' : 'text-ivory-300/60 group-hover:text-ivory-100'}`}>
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-[0.15em] text-ivory-300/40 hover:text-gold transition-colors"
                >
                  {t('catalog.clearFilters')}
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm text-ivory-300/60 hover:text-gold transition-colors"
                >
                  <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
                  {t('catalog.filters')}
                </button>
                <p className="text-sm text-ivory-300/40">
                  {pagination.total} {pagination.total === 1 ? t('catalog.product') : t('catalog.products')}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-ivory-300/40 uppercase tracking-[0.1em] hidden sm:inline">{t('catalog.sortBy')}</span>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-charcoal-800 text-ivory-100 text-sm border border-ivory-100/10 px-3 py-2 focus:outline-none focus:border-gold/50 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold text-xs">
                    {categories.find((c) => c._id === category)?.name || 'Category'}
                    <button onClick={() => updateFilter('category', '')}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {premium && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold text-xs">
                    {t('catalog.premium')}
                    <button onClick={() => updateFilter('premium', '')}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isNew && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold text-xs">
                    {t('catalog.newArrivals')}
                    <button onClick={() => updateFilter('new', '')}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {gift && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold text-xs">
                    {t('catalog.giftIdeas')}
                    <button onClick={() => updateFilter('gift', '')}>
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-charcoal-800 aspect-[3/4] mb-4" />
                    <div className="h-3 bg-charcoal-800 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-charcoal-800 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-charcoal-800 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-ivory-300/40 text-lg mb-2">{t('catalog.noProducts')}</p>
                <p className="text-ivory-300/30 text-sm">{t('catalog.adjustFilters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', p.toString())}
                      className={`w-10 h-10 text-sm transition-colors ${
                        page === p
                          ? 'bg-gold text-charcoal-900 font-medium'
                          : 'text-ivory-300/60 hover:text-gold border border-ivory-100/10 hover:border-gold/30'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-charcoal-900 border-r border-ivory-100/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm uppercase tracking-[0.2em]">{t('catalog.filters')}</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-ivory-300/60 hover:text-gold">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search with icon + clear */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-3">{t('catalog.search')}</h4>
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-300/30" />
                <input
                  type="text"
                  placeholder={t('catalog.search')}
                  value={searchInput}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50"
                />
                {searchInput && (
                  <button
                    onClick={() => { clearSearch(); setMobileFiltersOpen(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ivory-300/30 hover:text-gold"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile categories */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-3">{t('catalog.categories')}</h4>
              <div className="space-y-1">
                <button
                  onClick={() => { updateFilter('category', ''); setMobileFiltersOpen(false); }}
                  className={`block w-full text-left text-sm py-2 ${!category ? 'text-gold' : 'text-ivory-300/60'}`}
                >
                  {t('catalog.all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { updateFilter('category', cat._id); setMobileFiltersOpen(false); }}
                    className={`block w-full text-left text-sm py-2 ${category === cat._id ? 'text-gold' : 'text-ivory-300/60'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile price */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-3">{t('catalog.price')}</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (preset.min) params.set('minPrice', preset.min);
                      else params.delete('minPrice');
                      if (preset.max) params.set('maxPrice', preset.max);
                      else params.delete('maxPrice');
                      params.set('page', '1');
                      setSearchParams(params);
                      setMobileFiltersOpen(false);
                    }}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                      currentPricePreset === i
                        ? 'bg-gold text-charcoal-900 font-medium'
                        : 'border border-ivory-100/10 text-ivory-300/50 hover:border-gold/30 hover:text-gold'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile tags */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-3">{t('catalog.filters')}</h4>
              <div className="space-y-2">
                {FILTER_OPTIONS.map((opt) => {
                  const isActive = searchParams.get(opt.key) === opt.value;
                  return (
                    <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => { updateFilter(opt.key, isActive ? '' : opt.value); setMobileFiltersOpen(false); }}
                        className="w-4 h-4 bg-charcoal-800 border border-ivory-100/20 rounded checked:bg-gold checked:border-gold"
                      />
                      <span className={`text-sm ${isActive ? 'text-gold' : 'text-ivory-300/60'}`}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => { clearFilters(); setMobileFiltersOpen(false); }}
                className="text-xs uppercase tracking-[0.15em] text-ivory-300/40 hover:text-gold"
              >
                {t('catalog.clearFilters')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
