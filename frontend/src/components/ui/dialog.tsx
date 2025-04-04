import * as React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export type DialogProps = Omit<MuiDialogProps, 'title' | 'onClose'> & {
  title?: string | React.ReactElement;
  onClose?: () => void;
  actions?: React.ReactElement;
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ children, title, onClose, actions, ...props }, ref) => {
    return (
      <MuiDialog {...props} ref={ref}>
        {title && (
          <DialogTitle>
            {title}
            {onClose && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
        )}
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </MuiDialog>
    );
  }
); 