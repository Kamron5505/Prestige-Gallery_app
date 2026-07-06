import { Link, useLocation } from 'react-router-dom';
import { HiOutlineXMark, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import useAuthStore from '../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
];

const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user } = useAuthStore();

  const LINKS = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.catalog'), path: '/catalog' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.events'), path: '/events' },
    { label: t('nav.contacts'), path: '/contacts' },
    { label: t('nav.favorites'), path: '/account/favorites' },
    { label: t('nav.cart'), path: '/cart' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-charcoal-900 z-50 lg:hidden border-r border-ivory-100/5"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-ivory-100/5">
                <img
                  src="/images/logo.jpg"
                  alt="Prestige Gallery"
                  className="w-7 h-7 rounded-full object-cover dark:brightness-[1.8] dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
                />
                <button
                  onClick={onClose}
                  className="text-ivory-300/70 hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 py-8 overflow-y-auto">
                {LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`block px-8 py-4 text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'text-gold bg-gold/5 border-l-2 border-gold'
                        : 'text-ivory-300/70 hover:text-gold hover:bg-ivory-100/[0.02]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Language Switcher */}
                <div className="mt-8 pt-8 border-t border-ivory-100/5 px-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('nav.language')}</p>
                  <div className="flex flex-col gap-2">
                    {LANGUAGES.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => { i18n.changeLanguage(lng.code); onClose(); }}
                        className={`text-left text-sm py-2 px-3 rounded transition-colors ${
                          i18n.language === lng.code || (i18n.language?.startsWith(lng.code))
                            ? 'text-gold bg-gold/5 font-medium'
                            : 'text-ivory-300/60 hover:text-gold'
                        }`}
                      >
                        {lng.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="px-8 mt-4">
                  <button
                    onClick={() => { toggleTheme(); onClose(); }}
                    className="flex items-center gap-3 text-sm text-ivory-300/60 hover:text-gold transition-colors w-full py-2"
                  >
                    {isDark ? (
                      <>
                        <HiOutlineSun className="w-5 h-5" />
                        <span>{t('nav.theme')}: {t('nav.light')}</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineMoon className="w-5 h-5" />
                        <span>{t('nav.theme')}: {t('nav.dark')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Auth links */}
                <div className="mt-8 pt-8 border-t border-ivory-100/5 px-8">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/account"
                        onClick={onClose}
                        className="block py-3 text-sm uppercase tracking-[0.2em] text-ivory-300/70 hover:text-gold transition-colors"
                      >
                        {t('nav.myAccount')}
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={onClose}
                        className="block py-3 text-sm uppercase tracking-[0.2em] text-ivory-300/70 hover:text-gold transition-colors"
                      >
                        {t('nav.myOrders')}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={onClose}
                          className="block py-3 text-sm uppercase tracking-[0.2em] text-gold/70 hover:text-gold transition-colors"
                        >
                          {t('nav.adminPanel')}
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={onClose}
                        className="block py-3 text-sm uppercase tracking-[0.2em] text-ivory-300/70 hover:text-gold transition-colors"
                      >
                        {t('nav.signIn')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={onClose}
                        className="block py-3 text-sm uppercase tracking-[0.2em] text-ivory-300/70 hover:text-gold transition-colors"
                      >
                        {t('nav.createAccount')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
