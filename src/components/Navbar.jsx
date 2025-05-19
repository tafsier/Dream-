
    import React, { useState, useEffect, useCallback } from 'react';
    import { Link, NavLink, useNavigate } from 'react-router-dom';
    import { Sun, Moon, Menu, X, LogOut, User, Settings, LayoutDashboard, ChevronDown, Languages, Check } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
      DropdownMenuSub,
      DropdownMenuSubTrigger,
      DropdownMenuSubContent,
      DropdownMenuPortal
    } from '@/components/ui/dropdown-menu';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { useLanguage } from '@/contexts/useLanguage';
    
    const NavLinkItem = React.memo(({ to, children, onClick }) => (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary dark:bg-green-500/20 dark:text-green-300"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
          )
        }
      >
        {children}
      </NavLink>
    ));
    
    const UserAvatar = React.memo(({ user, onLogout, t }) => {
      const navigate = useNavigate();
      const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : (t('navbar.userGreeting')?.[0] || 'U');
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/50 dark:border-green-500/50">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={user?.email || t('navbar.userGreeting')} />
                <AvatarFallback className="bg-primary/20 dark:bg-green-500/30 text-primary dark:text-green-300 font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 shadow-lg rounded-md border dark:border-slate-700" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">{t('navbar.userGreeting')} {user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-slate-700" />
            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t('navbar.dashboard')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700">
              <User className="mr-2 h-4 w-4" />
              <span>{t('navbar.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings')} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('navbar.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-slate-700" />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/20 dark:focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('navbar.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    });
    
    const AuthButtons = React.memo(({ t }) => (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild className="text-primary dark:text-green-400 hover:bg-primary/10 dark:hover:bg-green-500/10">
          <Link to="/login">{t('navbar.login')}</Link>
        </Button>
        <Button asChild className="button-primary-gradient">
          <Link to="/signup">{t('navbar.signUp')}</Link>
        </Button>
      </div>
    ));
    
    const MobileMenu = React.memo(({ isOpen, navItems, closeMenu, t }) => (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-slate-800 divide-y-2 divide-gray-50 dark:divide-slate-700">
              <div className="pt-5 pb-6 px-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-4 gap-x-8">
                  {navItems.map((item) => (
                    <NavLinkItem key={item.nameKey} to={item.href} onClick={closeMenu}>
                      {t(item.nameKey)}
                    </NavLinkItem>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ));
    
    const LanguageSwitcher = React.memo(({ currentLanguage, setLanguage, t }) => {
      const languages = [
        { code: 'ar', name: t('navbar.arabic') },
        { code: 'en', name: t('navbar.english') },
      ];
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('navbar.toggleLanguageAriaLabel') || 'Change language'}>
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 shadow-lg rounded-md border dark:border-slate-700">
            <DropdownMenuLabel>{t('settings.selectLanguage')}</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-slate-700" />
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "flex items-center justify-between cursor-pointer",
                  currentLanguage === lang.code && "bg-primary/10 dark:bg-green-500/20"
                )}
              >
                <span>{lang.name}</span>
                {currentLanguage === lang.code && <Check className="h-4 w-4 text-primary dark:text-green-400" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    });
    
    const DarkModeToggle = React.memo(({ t }) => {
      const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
    
      useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
      }, [theme]);
    
      const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
          if (prevTheme === 'light') return 'dark';
          if (prevTheme === 'dark') return 'system';
          return 'light';
        });
      }, []);
    
      const getIcon = () => {
        if (theme === 'light') return <Sun className="h-5 w-5" />;
        if (theme === 'dark') return <Moon className="h-5 w-5" />;
        return <Settings className="h-5 w-5" />; 
      };
    
      return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('navbar.toggleThemeAriaLabel') || 'Toggle theme'}>
          {getIcon()}
        </Button>
      );
    });
    
    function Navbar() {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const { user, logout } = useAuth();
      const navigate = useNavigate();
      const { t, language, setLanguage } = useLanguage();
    
      const handleLogout = useCallback(async () => {
        await logout();
        navigate('/');
      }, [logout, navigate]);
    
      const navItems = [
        { nameKey: 'navbar.home', href: '/' },
        { nameKey: 'navbar.submitDream', href: '/submit-dream' },
        { nameKey: 'navbar.pricing', href: '/pricing' },
        { nameKey: 'navbar.dreamTypes', href: '/dream-types' },
        { nameKey: 'navbar.faq', href: '/faq' },
        { nameKey: 'navbar.contact', href: '/contact' },
      ];
    
      const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
      }, []);
    
      const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
      }, []);
    
      return (
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-slate-700/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0">
                  <span className="text-2xl font-bold text-primary dark:text-green-400">{t('appName')}</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {navItems.map((item) => (
                    <NavLinkItem key={item.nameKey} to={item.href}>
                      {t(item.nameKey)}
                    </NavLinkItem>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <LanguageSwitcher currentLanguage={language} setLanguage={setLanguage} t={t} />
                <DarkModeToggle t={t} />
                {user ? (
                  <UserAvatar user={user} onLogout={handleLogout} t={t} />
                ) : (
                  <div className="hidden md:block">
                    <AuthButtons t={t} />
                  </div>
                )}
                <div className="md:hidden">
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label={t('navbar.toggleMenuAriaLabel') || 'Toggle menu'}>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <MobileMenu isOpen={isMobileMenuOpen} navItems={navItems} closeMenu={closeMobileMenu} t={t} />
        </nav>
      );
    }
    
    export default Navbar;
  