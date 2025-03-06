
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, BarChart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const navItems = [
    { path: "/", label: "Cuestionarios", icon: <ClipboardList className="h-5 w-5" /> },
    { path: "/resultados", label: "Mis Resultados", icon: <BarChart className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-softGreen-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-softGreen-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-softGreen-400 flex items-center justify-center">
              <span className="text-white font-semibold">V</span>
            </div>
            <span className="font-medium text-foreground">Vitalytics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-softGreen-100 text-softGreen-700"
                    : "text-muted-foreground hover:bg-softGreen-50 hover:text-softGreen-600"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 pt-16 backdrop-blur-sm md:hidden">
          <motion.nav
            className="container mx-auto p-4 flex flex-col space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-softGreen-100 text-softGreen-700"
                    : "text-muted-foreground hover:bg-softGreen-50 hover:text-softGreen-600"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </motion.nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        {mounted && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-full"
          >
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
