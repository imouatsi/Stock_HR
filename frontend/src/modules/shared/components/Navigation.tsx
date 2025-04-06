import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  LocalShipping as ShippingIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAuth } from '../../../hooks/useAuth';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [stockOpen, setStockOpen] = React.useState(false);

  const handleStockClick = () => {
    setStockOpen(!stockOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isStockActive = () => {
    return location.pathname.startsWith('/stock');
  };

  const menuItems = [
    {
      text: t('dashboard.title'),
      icon: <DashboardIcon />,
      path: '/',
      permission: 'dashboard:view',
    },
  ];

  const stockItems = [
    {
      text: t('stock.inventory.title'),
      icon: <InventoryIcon />,
      path: '/stock/inventory',
      permission: 'stock:view',
    },
    {
      text: t('stock.categories.title'),
      icon: <CategoryIcon />,
      path: '/stock/categories',
      permission: 'stock:view',
    },
    {
      text: t('stock.suppliers.title'),
      icon: <PeopleIcon />,
      path: '/stock/suppliers',
      permission: 'stock:view',
    },
    {
      text: t('stock.movements.title'),
      icon: <ShippingIcon />,
      path: '/stock/movements',
      permission: 'stock:view',
    },
    {
      text: t('stock.purchaseOrders.title'),
      icon: <CartIcon />,
      path: '/stock/purchase-orders',
      permission: 'stock:view',
    },
  ];

  const hasStockPermission = user?.permissions.some(permission => 
    stockItems.some(item => item.permission === permission)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            user?.permissions.includes(item.permission) && (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
          ))}

          {hasStockPermission && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  selected={isStockActive()}
                  onClick={handleStockClick}
                >
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('stock.title')} />
                  {stockOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={stockOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {stockItems.map((item) => (
                    user?.permissions.includes(item.permission) && (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton
                          selected={isActive(item.path)}
                          onClick={() => navigate(item.path)}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} />
                        </ListItemButton>
                      </ListItem>
                    )
                  ))}
                </List>
              </Collapse>
            </>
          )}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Navigation; 