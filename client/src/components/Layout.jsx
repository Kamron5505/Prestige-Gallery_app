import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileDrawer from './MobileDrawer';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-charcoal-900 text-ivory-100 flex flex-col">
      <Navbar onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
