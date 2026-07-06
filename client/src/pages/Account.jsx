import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineCalendarDays, HiOutlineUser, HiOutlineMapPin, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Account = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const SIDEBAR_LINKS = [
    { label: t('account.myProfile'), path: '/account', icon: HiOutlineUser },
    { label: t('account.favorites'), path: '/account/favorites', icon: HiOutlineHeart },
    { label: t('account.orders'), path: '/account/orders', icon: HiOutlineShoppingBag },
    { label: t('account.myEvents'), path: '/account/events', icon: HiOutlineCalendarDays },
  ];

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/auth/profile', form);
      updateUser(res.data.user);
      toast.success(t('account.profileUpdated'));
      setEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    toast.success(t('account.loggedOut'));
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-28 space-y-1">
              <div className="mb-8">
                <p className="font-serif text-xl text-ivory-100">{user?.name}</p>
                <p className="text-sm text-ivory-300/40">{user?.email}</p>
              </div>
              {SIDEBAR_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    link.path === '/account'
                      ? 'text-gold bg-gold/5 border-l-2 border-gold'
                      : 'text-ivory-300/60 hover:text-gold hover:bg-ivory-100/[0.02]'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm text-ivory-300/40 hover:text-burgundy transition-colors w-full mt-8"
              >
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                {t('nav.signOut')}
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-subheading mb-3">{t('account.subtitle')}</p>
              <h1 className="section-heading">{t('account.title')}</h1>
            </motion.div>

            <div className="mt-10 max-w-2xl">
              {/* Personal Info */}
              <div className="bg-charcoal-800/30 border border-ivory-100/5 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-ivory-300/40">{t('account.personalInfo')}</h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-dark transition-colors"
                  >
                    {editing ? t('account.cancel') : t('account.edit')}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-ivory-300/40 mb-1.5">{t('account.name')}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ivory-300/40 mb-1.5">{t('account.phone')}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-charcoal-800 border border-ivory-100/10 text-ivory-100 text-sm focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary text-sm"
                    >
                      {saving ? t('account.saving') : t('account.saveChanges')}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-ivory-300/40 mb-1">{t('account.name')}</p>
                      <p className="text-ivory-100">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ivory-300/40 mb-1">{t('account.email')}</p>
                      <p className="text-ivory-100">{user?.email}</p>
                    </div>
                    {user?.phone && (
                      <div>
                        <p className="text-xs text-ivory-300/40 mb-1">{t('account.phone')}</p>
                        <p className="text-ivory-100">{user?.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-ivory-300/40 mb-1">{t('account.role')}</p>
                      <p className="text-ivory-100 capitalize">{user?.role}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Links - Mobile */}
              <div className="mt-8 lg:hidden space-y-1">
                {SIDEBAR_LINKS.slice(1).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-ivory-300/60 hover:text-gold hover:bg-ivory-100/[0.02] transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-ivory-300/40 hover:text-burgundy transition-colors w-full"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                  {t('nav.signOut')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
