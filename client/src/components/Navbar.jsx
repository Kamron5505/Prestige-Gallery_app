import { Link, useLocation } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineBars3, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.catalog', path: '/catalog' },
  { labelKey: 'nav.gallery', path: '/gallery' },
  { labelKey: 'nav.events', path: '/events' },
  { labelKey: 'nav.contacts', path: '/contacts' },
];

const LANGUAGES = [
  { code: 'uz', label: 'O\'zb' },
  { code: 'ru', label: 'Рус' },
];

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal-900/95 backdrop-blur-lg shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-ivory-100 hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <HiOutlineBars3 className="w-6 h-6" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <img
                src="/images/logo.jpg"
                alt="Prestige Gallery"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover opacity-90 group-hover:opacity-100 transition-all dark:ring-1 dark:ring-white/20 dark:ring-offset-2 dark:ring-offset-charcoal-900"
              />
            </Link>
          </div>

          {/* Center: Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:text-gold relative py-1 ${
                  location.pathname === link.path
                    ? 'text-gold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold'
                    : 'text-ivory-300/70'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Telegram */}
            <a
              href="https://t.me/prestigegallery_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[#0088cc]/70 hover:text-[#0088cc] transition-colors text-xs uppercase tracking-wider"
              aria-label="Telegram"
            >
              <FaTelegramPlane className="w-4 h-4" />
            </a>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 border border-ivory-300/20 rounded px-2 py-1">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => changeLanguage(lng.code)}
                  className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors ${
                    i18n.language === lng.code || (i18n.language?.startsWith(lng.code))
                      ? 'text-gold bg-gold/10 font-medium'
                      : 'text-ivory-300/50 hover:text-ivory-100'
                  }`}
                >
                  {lng.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-ivory-300/70 hover:text-gold transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <HiOutlineSun className="w-5 h-5" />
              ) : (
                <HiOutlineMoon className="w-5 h-5" />
              )}
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:block text-xs uppercase tracking-[0.15em] text-gold/70 hover:text-gold transition-colors"
              >
                {t('nav.admin')}
              </Link>
            )}

            <Link
              to="/account/favorites"
              className="hidden sm:block text-ivory-300/70 hover:text-rose transition-colors"
              aria-label="Favorites"
            >
              <HiOutlineHeart className="w-5 h-5" />
            </Link>

            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-ivory-300/70 hover:text-gold transition-colors"
              aria-label="Account"
            >
              <HiOutlineUser className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className="text-ivory-300/70 hover:text-gold transition-colors relative"
              aria-label="Cart"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-charcoal-900 text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
