import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api, setAccessToken } from '../lib/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const { user, accessToken } = res.data;
      setAccessToken(accessToken);
      login(user, accessToken);
      toast.success(`${t('auth.registrationSuccess')}, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/flower_6.jpg"
          alt="Golden flowers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 to-transparent" />
        <div className="absolute bottom-12 left-12">
          <p className="font-serif text-3xl text-ivory-100 mb-2">{t('auth.joinPrestige')}</p>
          <p className="text-ivory-300/50 text-sm">{t('auth.becomeMember')}</p>
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

          <h1 className="font-serif text-3xl text-ivory-100 mb-2">{t('auth.createAccount')}</h1>
          <p className="text-ivory-300/50 text-sm mb-10">{t('auth.createAccountDesc')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">{t('auth.fullName')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('auth.fullName')}
                required
                minLength={2}
                className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
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
              <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">{t('auth.phoneOptional')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t('auth.phonePlaceholder')}
                className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">{t('auth.password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t('auth.passwordPlaceholder')}
                required
                minLength={8}
                className="w-full px-5 py-3 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </form>

          <p className="text-center text-sm text-ivory-300/40 mt-8">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-gold hover:text-gold-dark transition-colors">
              {t('auth.signIn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
