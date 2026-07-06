import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark, HiOutlineHeart } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const GALLERY_IMAGES = [
  { src: '/images/flower_1.jpg', alt: 'Velvet Midnight Rose', category: 'premium' },
  { src: '/images/flower_2.jpg', alt: 'Golden Hour Bouquet', category: 'seasonal' },
  { src: '/images/flower_3.jpg', alt: 'Crimson Affair', category: 'premium' },
  { src: '/images/flower_4.jpg', alt: 'Ivory Dream Bouquet', category: 'wedding' },
  { src: '/images/flower_5.jpg', alt: 'Wild Meadow Mix', category: 'seasonal' },
  { src: '/images/flower_6.jpg', alt: 'Royal Orchid Cascade', category: 'premium' },
  { src: '/images/flower_7.jpg', alt: 'Summer Solstice Posy', category: 'seasonal' },
  { src: '/images/flower_8.jpg', alt: 'Moonlight Serenade', category: 'premium' },
  { src: '/images/flower_4.jpg', alt: 'Blush Peony Garden', category: 'premium' },
  { src: '/images/flower_10.jpg', alt: 'Minimalist Calla Lily', category: 'premium' },
  { src: '/images/flower_1.jpg', alt: 'Eternal Love Wreath', category: 'wedding' },
  { src: '/images/flower_2.jpg', alt: 'Spring Awakening', category: 'seasonal' },
];

const CATEGORIES = ['all', 'premium', 'seasonal', 'wedding'];

const Gallery = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="section-subheading mb-3">{t('gallery.subtitle')}</p>
          <h1 className="section-heading">{t('gallery.title')}</h1>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold text-charcoal-900 font-medium'
                  : 'text-ivory-300/60 border border-ivory-100/10 hover:border-gold/30 hover:text-gold'
              }`}
            >
              {t(`gallery.${cat}`)}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center p-4">
                    <p className="text-ivory-100 text-sm uppercase tracking-[0.15em]">{img.alt}</p>
                    <span className={`inline-block mt-2 text-[10px] uppercase tracking-[0.2em] px-3 py-1 ${
                      img.category === 'premium' ? 'bg-gold text-charcoal-900' :
                      img.category === 'wedding' ? 'bg-rose text-ivory-100' :
                      'bg-ivory-100/10 text-ivory-100'
                    }`}>
                      {t(`gallery.${img.category}`)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ivory-300/40 text-lg">{t('gallery.empty')}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 lg:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-ivory-100/70 hover:text-ivory-100 transition-colors z-10"
              aria-label="Close"
            >
              <HiOutlineXMark className="w-8 h-8" />
            </button>
            <motion.img
              key={selectedImage.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
