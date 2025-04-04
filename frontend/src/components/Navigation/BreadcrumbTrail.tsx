import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    icon?: JSX.Element;
  };
}

const pathConfig: BreadcrumbConfig = {
  dashboard: { label: 'Dashboard' },
  inventory: { label: 'Inventory' },
  contracts: { label: 'Contracts' },
  invoices: { label: 'Invoices' },
  users: { label: 'Users' },
  settings: { label: 'Settings' },
};

export const BreadcrumbTrail = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <Box sx={{ mb: 3, mt: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          custom={0}
        >
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': { textDecoration: 'none' },
            }}
          >
            Home
          </Link>
        </motion.div>

        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const config = pathConfig[segment] || { label: segment };

          return (
            <motion.div
              key={path}
              initial="hidden"
              animate="visible"
              variants={variants}
              custom={index + 1}
            >
              {isLast ? (
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  {config.icon}
                  {config.label}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={path}
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { textDecoration: 'none' },
                  }}
                >
                  {config.icon}
                  {config.label}
                </Link>
              )}
            </motion.div>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
