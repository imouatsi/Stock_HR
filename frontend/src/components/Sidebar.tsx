import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/stock', icon: <Package size={20} />, label: 'Stock' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Stock HR</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            asChild
            variant={location.pathname === item.path ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Link to={item.path}>
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={logout}
        >
          <LogOut size={20} />
          <span className="ml-2">Logout</span>
        </Button>
      </div>
    </div>
  );
} 