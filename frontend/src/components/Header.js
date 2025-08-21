import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticElement from './MagneticElement';
import KineticText from './KineticText';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.85]);
  const headerBlur = useTransform(scrollY, [0, 100], [16, 24]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/dashboard', label: '🧠 Neural Hub', icon: '🧠' },
    { path: '/diary/new', label: '✨ Create', icon: '✨' },
    { path: '/map', label: '🗺️ Reality Map', icon: '🗺️' },
    { path: '/gallery', label: '🎨 Visions', icon: '🎨' },
    { path: '/profile', label: '👤 Avatar', icon: '👤' },
    { path: '/login', label: '🔑 Matrix', icon: '🔑' },
  ];

  return (
    <motion.header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'py-2' : 'py-4'}
      `}
      style={{ 
        background: `rgba(0, 0, 0, ${headerOpacity})`,
        backdropFilter: `blur(${headerBlur}px)`,
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* 🌟 HOLOGRAPHIC LOGO */}
        <MagneticElement strength={0.1}>
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🧬
            </motion.div>
            <KineticText 
              variant="holographic" 
              className="text-2xl font-black tracking-tight group-hover:scale-105 transition-transform"
            >
              MemoryMap
            </KineticText>
          </Link>
        </MagneticElement>
        
        {/* 🎯 NEURAL NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <MagneticElement key={item.path} strength={0.05}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-xl font-medium text-sm
                    transition-all duration-300 group overflow-hidden
                    ${isActive(item.path) 
                      ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {/* Active State Glow */}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 rounded-xl"
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Hover Ripple Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="hidden lg:inline">{item.label.split(' ')[1] || item.label}</span>
                  </span>
                </Link>
              </motion.div>
            </MagneticElement>
          ))}
        </nav>

        {/* 📱 MOBILE MENU BUTTON */}
        <motion.button
          className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
            <div className="w-4 h-0.5 bg-white rounded" />
            <div className="w-4 h-0.5 bg-white rounded" />
            <div className="w-4 h-0.5 bg-white rounded" />
          </div>
        </motion.button>
      </div>

      {/* 🌊 NEURAL SCAN LINE */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ width: '100%' }}
      />
    </motion.header>
  );
};

export default Header; 