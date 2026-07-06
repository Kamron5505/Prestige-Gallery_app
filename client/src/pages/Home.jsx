import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlinePhone, HiOutlineStar } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 },
};

const Home = () => {
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: HiOutlineSparkles,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
    },
    {
      icon: HiOutlineTruck,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
    },
    {
      icon: HiOutlineShieldCheck,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
    },
    {
      icon: HiOutlinePhone,
      title: t('home.feature4Title'),
      description: t('home.feature4Desc'),
    },
  ];

  const { data: productsData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products?limit=8&sort=newest'),
  });

  const products = productsData?.data?.products || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] max-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/flower_1.jpg"
              alt=""
              className="w-full h-full object-cover blur-[6px] scale-110"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold/80 text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 font-elegant"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-elegant text-[clamp(2.5rem,8vw,7rem)] text-ivory-100 leading-[1.1] mb-4"
          >
            {t('hero.title1')}
            <br />
            <span className="text-gradient-gold font-script italic text-hero" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 1.2 }}>{t('hero.title2')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-ivory-300/50 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4"
          >
            {t('hero.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/catalog" className="btn-primary w-full sm:w-auto min-w-[200px] group">
              {t('hero.cta')}
              <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/events" className="btn-secondary w-full sm:w-auto min-w-[200px]">
              {t('hero.ctaEvents')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/40 to-transparent" />
        </motion.div>
      </section>

      {/* Popular Bouquets */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="section-subheading mb-4">{t('home.featured')}</p>
            <h2 className="section-heading text-balance">{t('home.popularBouquets')}</h2>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {products.slice(0, 4).map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <Link to="/catalog" className="btn-outline group">
              {t('home.viewAll')}
              <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-charcoal-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="section-subheading mb-4">{t('home.whyUs')}</p>
            <h2 className="section-heading text-balance">{t('home.prestigeDifference')}</h2>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-gold/60 group-hover:text-gold transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-xl text-ivory-100 mb-3">{feature.title}</h3>
                <p className="text-ivory-300/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/flower_6.jpg"
            alt="Custom flower arrangement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/70 to-charcoal-900/90" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <p className="section-subheading mb-4 text-gold/60">{t('home.bespokeArrangements')}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-ivory-100 mb-6">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-ivory-300/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {t('home.ctaDesc')}
            </p>
            <Link to="/catalog" className="btn-primary min-w-[220px] group">
              {t('home.ctaButton')}
              <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 lg:py-32 bg-charcoal-800/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="section-subheading mb-4">{t('reviews.subtitle')}</p>
            <h2 className="section-heading text-balance">{t('reviews.title')}</h2>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {t('testimonials', { returnObjects: true }).slice(0, 6).map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 lg:p-8 border border-ivory-100/5 hover:border-gold/20 transition-all duration-500 group"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <HiOutlineStar
                      key={s}
                      className={`w-3.5 h-3.5 ${s < review.rating ? 'text-gold fill-gold' : 'text-ivory-300/20'}`}
                    />
                  ))}
                </div>
                <p className="text-ivory-300/60 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-ivory-100/5">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-gold">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-ivory-100">{review.name}</p>
                    <p className="text-[10px] text-ivory-300/30 uppercase tracking-[0.1em]">
                      {review.rating}/5 {t('reviews.rating')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-ivory-100/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <p className="section-subheading mb-4">{t('common.stayInspired')}</p>
            <h2 className="font-serif text-2xl md:text-3xl text-ivory-100 mb-4">
              {t('home.newsletterTitle')}
            </h2>
            <p className="text-ivory-300/50 text-sm mb-8">
              {t('home.newsletterDesc')}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder={t('home.newsletterPlaceholder')}
                className="flex-1 px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                {t('home.newsletterButton')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
