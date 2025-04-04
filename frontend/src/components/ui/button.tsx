import * as React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonProps = Omit<MuiButtonProps, 'children'> & {
  children: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiButton {...props} ref={ref}>
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button'; 