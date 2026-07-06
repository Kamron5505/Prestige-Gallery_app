import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const Events = () => {
  const { t } = useTranslation();
  const eventsData = t('events.events', { returnObjects: true });

  const EVENTS = Array.isArray(eventsData) ? eventsData.map((event, i) => {
    const images = [
      '/images/flower_4.jpg',
      '/images/flower_3.jpg',
      '/images/flower_1.jpg',
      '/images/flower_5.jpg',
    ];
    const links = [
      '/catalog?category=wedding-collections',
      '/catalog',
      '/catalog?category=premium-roses',
      '/catalog',
    ];
    return {
      ...event,
      image: images[i] || images[0],
      link: links[i] || links[0],
    };
  }) : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/flower_4.jpg"
            alt="Special events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 to-charcoal-900" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold/80 text-xs uppercase tracking-[0.3em] mb-4"
          >
            {t('events.subtitle')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-ivory-100"
          >
            {t('events.title')}
          </motion.h1>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {EVENTS.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative overflow-hidden bg-charcoal-800 aspect-[4/5]"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-2">{event.subtitle}</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-ivory-100 mb-3">{event.title}</h2>
                  <p className="text-ivory-300/60 text-sm max-w-md mb-6">{event.description}</p>
                  <Link
                    to={event.link}
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-gold hover:text-gold-dark transition-colors group/link"
                  >
                    {t('events.exploreCollection')}
                    <HiOutlineArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-ivory-100/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subheading mb-4">{t('events.bespokeService')}</p>
            <h2 className="font-serif text-3xl text-ivory-100 mb-4">{t('events.planEvent')}</h2>
            <p className="text-ivory-300/50 text-sm mb-8 max-w-md mx-auto">
              {t('events.planEventDesc')}
            </p>
            <a href="mailto:events@prestigegallery.com" className="btn-primary">
              {t('events.contactTeam')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
