import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api, setAccessToken } from '../lib/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { user, accessToken } = res.data;
      setAccessToken(accessToken);
      login(user, accessToken);
      toast.success(`${t('auth.welcomeMessage')}, ${user.name}`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/flower_1.jpg"
          alt="Luxury flowers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 to-transparent" />
        <div className="absolute bottom-12 left-12">
          <p className="font-serif text-3xl text-ivory-100 mb-2">{t('auth.welcomeBack')}</p>
          <p className="text-ivory-300/50 text-sm">{t('auth.continueJourney')}</p>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-10 block">
            <img
              src="/images/logo.jpg"
              alt="Prestige Gallery"
              className="w-8 h-8 rounded-full object-cover dark:brightness-[1.8] dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]"
            />
          </Link>

          <h1 className="font-serif text-3xl text-ivory-100 mb-2">{t('auth.signIn')}</h1>
          <p className="text-ivory-300/50 text-sm mb-10">{t('auth.signInDesc')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">{t('auth.password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? t('auth.signingIn') : t('auth.signInButton')}
            </button>
          </form>

          <p className="text-center text-sm text-ivory-300/40 mt-8">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-gold hover:text-gold-dark transition-colors">
              {t('auth.createOne')}
            </Link>
          </p>

          {/* Test credentials hint */}
          <div className="mt-8 p-4 border border-ivory-100/5 bg-charcoal-800/50">
            <p className="text-xs text-ivory-300/30 uppercase tracking-[0.1em] mb-2">{t('auth.testAccounts')}</p>
            <p className="text-xs text-ivory-300/40">{t('auth.adminAccount')}</p>
            <p className="text-xs text-ivory-300/40">{t('auth.customerAccount')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
