import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6"
      >
        <p className="font-serif text-8xl text-gold/30 mb-4">404</p>
        <h1 className="font-serif text-3xl text-ivory-100 mb-3">{t('common.pageNotFound')}</h1>
        <p className="text-ivory-300/50 mb-8 max-w-md mx-auto">
          {t('common.pageNotFoundDesc')}
        </p>
        <Link to="/" className="btn-primary">
          {t('common.returnHome')}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
