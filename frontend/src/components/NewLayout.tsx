import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { logout } from '../features/auth/authSlice';
import { AppDispatch } from '../features/store';
import { updateLanguage, toggleTheme } from '../features/slices/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Settings,
  User,
  Languages,
  LayoutDashboard,
  Package,
  FileText,
  Receipt,
  Users,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { languages } from '@/i18n';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  HR_MANAGER: 'hr_manager',
  ACCOUNTANT: 'accountant',
  STOCK_MANAGER: 'stock_manager'
} as const;

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  roles?: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'stock',
    label: 'stock.title',
    path: '/stock',
    icon: <Package className="h-4 w-4" />,
    roles: [ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'stock-inventory', label: 'stock.inventory', path: '/stock/inventory', icon: <Package className="h-4 w-4" /> },
      { id: 'stock-categories', label: 'stock.categories', path: '/stock/categories', icon: <FileText className="h-4 w-4" /> },
      { id: 'stock-suppliers', label: 'stock.suppliers', path: '/stock/suppliers', icon: <Users className="h-4 w-4" /> },
      { id: 'stock-movements', label: 'stock.movements', path: '/stock/movements', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'stock-purchase-orders', label: 'stock.purchaseOrders', path: '/stock/purchase-orders', icon: <Receipt className="h-4 w-4" /> },
    ],
  },
  {
    id: 'hr',
    label: 'hr.title',
    path: '/hr',
    icon: <Users className="h-4 w-4" />,
    roles: [ROLES.HR_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'hr-employees', label: 'hr.employees', path: '/hr/employees', icon: <Users className="h-4 w-4" /> },
      { id: 'hr-departments', label: 'hr.departments', path: '/hr/departments', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-positions', label: 'hr.positions', path: '/hr/positions', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-leave-requests', label: 'hr.leaveRequests', path: '/hr/leave-requests', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-performance', label: 'hr.performanceReviews', path: '/hr/performance', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    id: 'accounting',
    label: 'accounting.title',
    path: '/accounting',
    icon: <Receipt className="h-4 w-4" />,
    roles: [ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'accounting-invoices', label: 'accounting.invoices', path: '/accounting/invoices', icon: <Receipt className="h-4 w-4" /> },
      { id: 'accounting-contracts', label: 'accounting.contracts', path: '/accounting/contracts', icon: <FileText className="h-4 w-4" /> },
      { id: 'accounting-proformas', label: 'accounting.proformas', path: '/accounting/proformas', icon: <FileText className="h-4 w-4" /> },
      { id: 'accounting-journal', label: 'accounting.journalEntries', path: '/accounting/journal', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'accounting-chart', label: 'accounting.chartOfAccounts', path: '/accounting/chart', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'accounting-statements', label: 'accounting.financialStatements', path: '/accounting/statements', icon: <FileSpreadsheet className="h-4 w-4" /> },
    ],
  },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.settings);
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === 'rtl';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(20px)';
      setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('rtl', isRTL);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleLanguageSelect = (langCode: string) => {
    dispatch(updateLanguage(langCode));
    i18n.changeLanguage(langCode);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const hasAccess = (item: MenuItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasAccess(item)) return null;

    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            'w-full flex items-center justify-between',
            hasChildren ? 'font-semibold' : 'pl-4'
          )}
          onClick={() => item.path && handleNavigation(item.path)}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span>{t(item.label)}</span>
          </div>
          {hasChildren && (
            <ChevronRight 
              className={cn(
                'h-4 w-4 transition-transform',
                isRTL && 'rotate-180'
              )} 
            />
          )}
        </Button>
        {hasChildren && (
          <div className="pl-4 space-y-1">
            {item.children.map((child) => (
              <Button
                key={child.id}
                variant="ghost"
                className="w-full flex items-center gap-2 justify-start"
                onClick={() => child.path && handleNavigation(child.path)}
              >
                {child.icon}
                <span>{t(child.label)}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'} className="w-[240px] p-0">
          <SheetHeader>
            <SheetTitle className="px-4">{t('common.dashboard')}</SheetTitle>
            <SheetDescription className="sr-only">
              {t('common.navigation')}
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between px-4">
              <SheetClose>
                <X size={20} />
              </SheetClose>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-4">
                {menuItems.map(renderMenuItem)}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r transition-all duration-300 ${
          isCollapsed ? 'w-[65px]' : 'w-[240px]'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          {!isCollapsed && <h1 className="text-lg font-semibold">{t('common.dashboard')}</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDrawerToggle}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-4">
            {menuItems.map(renderMenuItem)}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className={cn(
                "transition-colors",
                isRTL && "ml-4"
              )}
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "transition-colors",
                    isRTL && "ml-4"
                  )}
                >
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={cn(
                      "flex items-center gap-2",
                      i18n.language === lang.code && "bg-accent"
                    )}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "relative transition-colors",
                    isRTL && "ml-4"
                  )}
                >
                  <Bell size={20} />
                  <Badge className="absolute -right-1 -top-1">3</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80">
                <DropdownMenuLabel>{t('common.notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add notification items here */}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "gap-2 transition-colors",
                    isRTL && "ml-4"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  {!isMobile && <span>{user?.name}</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  <span>{t('profile.title')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  <span>{t('settings.title')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  <span>{t('auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout; 