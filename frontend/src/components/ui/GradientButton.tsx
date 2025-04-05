import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
  },
  '&.small': {
    height: 36,
    padding: '0 20px',
  },
}));

export interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  small?: boolean;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, small, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        className={`${className || ''} ${small ? 'small' : ''}`}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export default GradientButton; 