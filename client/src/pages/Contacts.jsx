import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock } from 'react-icons/hi2';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

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
  transition: { staggerChildren: 0.12 },
};

const Contacts = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const CONTACT_INFO = [
    {
      icon: HiOutlineMapPin,
      label: t('contacts.address'),
      href: null,
      value: t('contacts.address'),
    },
    {
      icon: HiOutlinePhone,
      label: t('contacts.phone'),
      href: 'tel:+998712345678',
      value: '+998 71 234 56 78',
    },
    {
      icon: HiOutlineEnvelope,
      label: t('contacts.email'),
      href: 'mailto:hello@prestigegallery.com',
      value: 'hello@prestigegallery.com',
    },
    {
      icon: HiOutlineClock,
      label: t('contacts.workingHours'),
      href: null,
      value: t('contacts.hours'),
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <p className="section-subheading mb-3">{t('contacts.subtitle')}</p>
          <h1 className="section-heading">{t('contacts.title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              {CONTACT_INFO.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center shrink-0 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                    <info.icon className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
                  </div>
                  <div className="pt-2">
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-ivory-300/60 hover:text-gold transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-ivory-300/60 whitespace-pre-line">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Telegram & WhatsApp */}
            <div className="space-y-4 pt-4 border-t border-ivory-100/5">
              <motion.a
                href="https://t.me/prestigegallery_uz"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-[#0088cc]/20 hover:border-[#0088cc]/50 hover:bg-[#0088cc]/5 transition-all duration-300 group"
              >
                <FaTelegramPlane className="w-6 h-6 text-[#0088cc]" />
                <div>
                  <p className="text-sm font-medium text-ivory-100 group-hover:text-[#0088cc] transition-colors">
                    {t('contacts.telegram')}
                  </p>
                  <p className="text-xs text-ivory-300/40 mt-0.5">
                    {t('contacts.telegramDesc')}
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.me/998712345678"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-[#25D366]/20 hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all duration-300 group"
              >
                <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
                <div>
                  <p className="text-sm font-medium text-ivory-100 group-hover:text-[#25D366] transition-colors">
                    {t('contacts.whatsapp')}
                  </p>
                  <p className="text-xs text-ivory-300/40 mt-0.5">
                    {t('contacts.whatsappDesc')}
                  </p>
                </div>
              </motion.a>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ivory-300/40 mb-4">{t('contacts.followUs')}</p>
              <div className="flex gap-3">
                {[
                  { icon: FaTelegramPlane, href: '#', color: '#0088cc' },
                  { icon: FaWhatsapp, href: '#', color: '#25D366' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-ivory-100/10 flex items-center justify-center hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group"
                  >
                    <social.icon className="w-4 h-4 text-ivory-300/40 group-hover:text-gold transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-charcoal-800/50 border border-ivory-100/5 p-8 lg:p-10">
              <h2 className="font-serif text-xl text-ivory-100 mb-8">
                {t('contacts.formTitle')}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <HiOutlineEnvelope className="w-8 h-8 text-gold" />
                  </div>
                  <p className="text-ivory-100 text-lg mb-2">{t('contacts.formSuccess')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">
                      {t('contacts.formName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder={t('contacts.formName')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">
                      {t('contacts.formEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-ivory-300/40 mb-2">
                      {t('contacts.formMessage')}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-charcoal-900 border border-ivory-100/10 text-ivory-100 placeholder:text-ivory-300/20 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
                      placeholder={t('contacts.formMessage')}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full group">
                    {t('contacts.formSend')}
                    <HiOutlineEnvelope className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <div className="bg-charcoal-800/30 border border-ivory-100/5 overflow-hidden">
            <div className="aspect-[21/9] min-h-[300px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.5!2d69.279!3d41.311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzM5LjYiTiA2OcKwMTYnNDQuNCJF!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prestige Gallery Location"
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-700"
              />
            </div>
            <div className="p-4 bg-charcoal-800/50">
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="w-4 h-4 text-gold" />
                <p className="text-xs text-ivory-300/50">{t('contacts.address')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacts;
