import React, { useState, useEffect, useRef } from 'react';
import { getRoleAvatar } from '../utils/avatarUtils';
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
  Calendar,
  BookOpen,
  Home,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';


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

const getMenuItems = (t: any): MenuItem[] => [
  {
    id: 'dashboard',
    label: t('common.dashboard'),
    path: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.HR_MANAGER, ROLES.ACCOUNTANT, ROLES.STOCK_MANAGER],
  },
  {
    id: 'stock',
    label: t('stock.title'),
    path: '/dashboard/stock',
    icon: <Package className="h-4 w-4" />,
    roles: [ROLES.STOCK_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'stock-products', label: t('stock.products.title'), path: '/stock/products', icon: <Package className="h-4 w-4" /> },
      { id: 'stock-warehouses', label: t('stock.warehouses.title'), path: '/stock/warehouses', icon: <Home className="h-4 w-4" /> },
      { id: 'stock-inventory', label: t('stock.inventory.title'), path: '/dashboard/stock/inventory', icon: <Package className="h-4 w-4" /> },
      { id: 'stock-categories', label: t('stock.categories.title'), path: '/dashboard/stock/categories', icon: <FileText className="h-4 w-4" /> },
      { id: 'stock-suppliers', label: t('stock.suppliers.title'), path: '/dashboard/stock/suppliers', icon: <Users className="h-4 w-4" /> },
      { id: 'stock-movements', label: t('stock.movements.title'), path: '/dashboard/stock/movements', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'stock-purchase-orders', label: t('stock.purchaseOrders.title'), path: '/dashboard/stock/purchase-orders', icon: <Receipt className="h-4 w-4" /> },
    ],
  },
  {
    id: 'hr',
    label: t('hr.title'),
    path: '/dashboard/hr',
    icon: <Users className="h-4 w-4" />,
    roles: [ROLES.HR_MANAGER, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'hr-employees', label: t('hr.employees.title'), path: '/dashboard/hr/employees', icon: <Users className="h-4 w-4" /> },
      { id: 'hr-departments', label: t('hr.departments.title'), path: '/dashboard/hr/departments', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-positions', label: t('hr.positions.title'), path: '/dashboard/hr/positions', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-leave-requests', label: t('hr.leaveRequests.title'), path: '/dashboard/hr/leave-requests', icon: <FileText className="h-4 w-4" /> },
      { id: 'hr-payroll', label: t('hr.payroll.title'), path: '/dashboard/hr/payroll', icon: <Receipt className="h-4 w-4" /> },
      { id: 'hr-performance', label: t('hr.performanceReviews.title'), path: '/dashboard/hr/performance', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    id: 'accounting',
    label: t('accounting.title'),
    path: '/accounting',
    icon: <Receipt className="h-4 w-4" />,
    roles: [ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPERADMIN],
    children: [
      { id: 'accounting-invoices', label: t('accounting.invoices.title'), path: '/accounting/invoices', icon: <Receipt className="h-4 w-4" /> },
      { id: 'accounting-contracts', label: t('accounting.contracts.title'), path: '/accounting/contracts', icon: <FileText className="h-4 w-4" /> },
      { id: 'accounting-proformas', label: t('accounting.proforma.title'), path: '/accounting/proformas', icon: <FileText className="h-4 w-4" /> },
      { id: 'accounting-journal', label: t('accounting.journalEntries.title'), path: '/accounting/journal-entries', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'accounting-chart', label: t('accounting.chartOfAccounts.title'), path: '/accounting/chart-of-accounts', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'accounting-periods', label: t('accounting.accountingPeriods.title'), path: '/accounting/accounting-periods', icon: <Calendar className="h-4 w-4" /> },
      { id: 'accounting-ledger', label: t('accounting.generalLedger.title'), path: '/accounting/general-ledger', icon: <BookOpen className="h-4 w-4" /> },
      { id: 'accounting-statements', label: t('accounting.financialStatements.title'), path: '/accounting/financial-statements', icon: <FileSpreadsheet className="h-4 w-4" /> },
      { id: 'accounting-tax-reporting', label: t('accounting.taxReporting.title'), path: '/accounting/tax-reporting', icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseInt(savedWidth) : 240;
  });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Mock user data for development
  const mockUser = {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['all'],
    avatar: '',
    isActive: true
  };

  // Use mock data instead of Redux store for now
  // const { user } = useSelector((state: RootState) => state.auth);
  // const { settings } = useSelector((state: RootState) => state.settings);
  const user = mockUser;
  const settings = {
    language: 'en',
    theme: 'light',
    notifications: true
  };

  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === 'rtl';

  // Get translated menu items
  const translatedMenuItems = getMenuItems(t);

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

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

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
    navigate('/dashboard/profile');
  };

  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
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
            hasChildren ? 'font-semibold' : (isRTL ? 'pr-4' : 'pl-4')
          )}
          onClick={() => item.path && handleNavigation(item.path)}
        >
          <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            {item.icon}
            <span>{item.label}</span>
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
          <div className={cn(
            "space-y-1",
            isRTL ? "pr-4" : "pl-4"
          )}>
            {item.children.map((child) => (
              <Button
                key={child.id}
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-2",
                  isRTL ? "flex-row-reverse justify-end" : "justify-start"
                )}
                onClick={() => child.path && handleNavigation(child.path)}
              >
                {child.icon}
                <span>{child.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing.current || !sidebarRef.current) return;

    let newWidth;
    if (isRTL) {
      // For RTL, calculate from the right edge of the screen
      newWidth = window.innerWidth - e.clientX;
    } else {
      // For LTR, use the standard calculation
      newWidth = e.clientX;
    }

    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return (
    <div className={`flex h-screen ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'} className="w-[240px] p-0">
          <SheetHeader>
            <SheetTitle className="px-4">404 ENTERPRISE</SheetTitle>
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
                {translatedMenuItems.map(renderMenuItem)}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className={`hidden md:flex flex-col ${isRTL ? 'border-l' : 'border-r'} transition-all duration-300 relative`}
        style={{
          width: isCollapsed ? '65px' : `${sidebarWidth}px`
        }}
      >
        <div className="flex h-14 items-center justify-between px-4">
          {!isCollapsed && <h1 className="text-lg font-semibold">404 ENTERPRISE</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDrawerToggle}
          >
            {isCollapsed
              ? (isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />)
              : (isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)
            }
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-4">
            {translatedMenuItems.map(renderMenuItem)}
          </div>
        </ScrollArea>
        {!isCollapsed && (
          <div
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700`}
            onMouseDown={handleResizeStart}
          />
        )}
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
                <DropdownMenuItem
                  onClick={() => handleLanguageSelect('en')}
                  className={cn(
                    "flex items-center gap-2",
                    i18n.language === 'en' && "bg-accent"
                  )}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageSelect('fr')}
                  className={cn(
                    "flex items-center gap-2",
                    i18n.language === 'fr' && "bg-accent"
                  )}
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageSelect('ar')}
                  className={cn(
                    "flex items-center gap-2",
                    i18n.language === 'ar' && "bg-accent"
                  )}
                >
                  العربية
                </DropdownMenuItem>
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
                <div className="p-2">
                  <div className="mb-2 rounded-md bg-accent p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{t('notifications.newUpdate.title')}</p>
                        <p className="text-xs text-muted-foreground">{t('notifications.newUpdate.description')}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('common.timeAgo.hour', { count: 1 })}</span>
                    </div>
                  </div>
                  <div className="mb-2 rounded-md bg-accent p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{t('notifications.newMessage.title')}</p>
                        <p className="text-xs text-muted-foreground">{t('notifications.newMessage.description')}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('common.timeAgo.hour', { count: 3 })}</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-accent p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{t('notifications.subscription.title')}</p>
                        <p className="text-xs text-muted-foreground">{t('notifications.subscription.description')}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{t('common.timeAgo.hour', { count: 5 })}</span>
                    </div>
                  </div>
                </div>
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
                    <AvatarImage src={`/assets/${getRoleAvatar(user?.role)}`} alt={user?.username || 'User'} />
                    <AvatarFallback>{(user?.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {!isMobile && <span>{user?.username || 'User'}</span>}
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