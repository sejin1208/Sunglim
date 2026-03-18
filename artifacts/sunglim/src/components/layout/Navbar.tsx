import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "회사소개", href: "/company" },
  { name: "제품소개", href: "/products" },
  { name: "납품사례", href: "/delivery" },
  { name: "고객센터", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl leading-tight tracking-tight text-primary">
                  성림교구
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
                  SUNGLIM EDU
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location === link.href || (location.startsWith(link.href) && link.href !== '/');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors relative py-2 ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Phone className="w-4 h-4 text-primary" />
                <span>02-766-1496</span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4 pb-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link) => {
                const isActive = location === link.href || (location.startsWith(link.href) && link.href !== '/');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between p-4 rounded-xl text-lg font-semibold transition-colors ${
                      isActive ? "bg-primary/5 text-primary" : "hover:bg-secondary/50 text-foreground"
                    }`}
                  >
                    {link.name}
                    <ChevronRight className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </Link>
                );
              })}
              
              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">고객상담센터</p>
                <a href="tel:02-766-1496" className="flex items-center gap-3 text-xl font-bold text-primary">
                  <Phone className="w-6 h-6" />
                  02-766-1496
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
