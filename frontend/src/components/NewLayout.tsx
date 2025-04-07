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
} from 'lucide-react';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

const menuItems = [
  { text: 'dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['admin', 'superadmin', 'manager', 'inventory_clerk'] },
  { text: 'inventory', icon: <Package size={20} />, path: '/inventory', roles: ['admin', 'superadmin', 'inventory_clerk'] },
  { text: 'contracts', icon: <FileText size={20} />, path: '/contracts', roles: ['superadmin'] },
  { text: 'invoices', icon: <Receipt size={20} />, path: '/invoices', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'proforma', icon: <FileSpreadsheet size={20} />, path: '/proforma-invoices', roles: ['admin', 'superadmin', 'manager'] },
  { text: 'users', icon: <Users size={20} />, path: '/users', roles: ['admin', 'superadmin'] },
  { text: 'settings', icon: <Settings size={20} />, path: '/settings', roles: ['admin', 'superadmin'] },
];

const NewLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { settings } = useSelector((state: RootState) => state.settings);
  const { t, i18n } = useTranslation();

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
    dispatch(toggleTheme());
  };

  const renderMenuItems = () => {
    return menuItems.map((item) => {
      if (!item.roles.includes(user?.role || '')) return null;
      
      return (
        <Button
          key={item.text}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon}
          {!isCollapsed && <span className="ml-2">{t(item.text)}</span>}
        </Button>
      );
    });
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between px-4">
              <h1 className="text-lg font-semibold">Stock HR</h1>
              <SheetClose>
                <X size={20} />
              </SheetClose>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-4">
                {renderMenuItems()}
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
          {!isCollapsed && <h1 className="text-lg font-semibold">Stock HR</h1>}
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
            {renderMenuItems()}
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
            >
              {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -right-1 -top-1">3</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add notification items here */}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  {!isMobile && <span>{user?.name}</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
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
};

export default NewLayout; 