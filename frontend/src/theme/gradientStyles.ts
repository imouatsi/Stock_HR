import { Theme } from '@mui/material';

export const gradientText = {
  fontWeight: 600,
  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: 0,
    width: '100%',
    height: 2,
    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
};

export const gradientBox = {
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
};

export const pageContainer = {
  p: 3,
  '& .page-title': {
    mb: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

export const tableContainer = (theme: Theme) => ({
  boxShadow: theme.shadows[2],
  borderRadius: 2,
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    borderColor: theme.palette.divider,
  },
  position: 'relative',
  ...gradientBox,
});

export const tableHeader = {
  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
  '& .MuiTableCell-head': {
    color: 'white',
  },
};

export const dialogTitle = {
  ...gradientText,
  py: 2,
};

export const dialogPaper = {
  borderRadius: 2,
  ...gradientBox,
}; 