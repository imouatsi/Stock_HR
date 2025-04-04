import * as React from 'react';
import {
  Menu,
  MenuItem,
  MenuProps,
  MenuItemProps,
  IconButton,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

export type DropdownMenuProps = Omit<MenuProps, 'open' | 'anchorEl'> & {
  trigger?: React.ReactElement;
  children: React.ReactElement | React.ReactElement[];
};

export type DropdownMenuItemProps = Omit<MenuItemProps, 'children'> & {
  children: string | React.ReactElement;
};

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, trigger, ...props }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        {trigger ? (
          React.cloneElement(trigger, { onClick: handleClick })
        ) : (
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          {...props}
        >
          {children}
        </Menu>
      </>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuItem = React.forwardRef<HTMLLIElement, DropdownMenuItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <MenuItem ref={ref} {...props}>
        {children}
      </MenuItem>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem'; 