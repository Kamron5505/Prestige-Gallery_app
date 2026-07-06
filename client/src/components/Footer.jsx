import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal-900 border-t border-ivory-100/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img
                src="/images/logo.jpg"
                alt="Prestige Gallery"
                className="w-8 h-8 rounded-full object-cover opacity-80 hover:opacity-100 transition-all dark:brightness-[1.8] dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
              />
            </Link>
            <p className="mt-4 text-ivory-300/50 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.catalog'), path: '/catalog' },
                { label: t('nav.events'), path: '/events' },
                { label: t('nav.cart'), path: '/cart' },
                { label: t('nav.myAccount'), path: '/account' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-ivory-300/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-6">{t('footer.collections')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('footer.premiumRoses'), slug: 'premium-roses' },
                { label: t('footer.seasonalBlooms'), slug: 'seasonal-blooms' },
                { label: t('footer.weddingCollections'), slug: 'wedding-collections' },
                { label: t('footer.luxuryGifts'), slug: 'luxury-gifts' },
              ].map(
                (cat) => (
                  <li key={cat.label}>
                    <Link
                      to={`/catalog?category=${cat.slug}`}
                      className="text-sm text-ivory-300/60 hover:text-gold transition-colors duration-300"
                    >
                      {cat.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiOutlineMapPin className="w-4 h-4 text-gold/60 mt-0.5 shrink-0" />
                <span className="text-sm text-ivory-300/60">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="tel:+998712345678" className="text-sm text-ivory-300/60 hover:text-gold transition-colors">
                  +998 71 234 56 78
                </a>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineEnvelope className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="mailto:hello@prestigegallery.com" className="text-sm text-ivory-300/60 hover:text-gold transition-colors">
                  hello@prestigegallery.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-ivory-100/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory-300/30 tracking-[0.1em]">
            &copy; {new Date().getFullYear()} Prestige Gallery. {t('footer.allRightsReserved')}
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-ivory-300/30 tracking-[0.1em] hover:text-ivory-300/50 transition-colors cursor-pointer">
              {t('footer.privacyPolicy')}
            </span>
            <span className="text-xs text-ivory-300/30 tracking-[0.1em] hover:text-ivory-300/50 transition-colors cursor-pointer">
              {t('footer.termsOfService')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
