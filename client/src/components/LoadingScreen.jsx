import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-charcoal-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6" />
        <p className="text-ivory-300/50 text-sm uppercase tracking-[0.3em]">{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
