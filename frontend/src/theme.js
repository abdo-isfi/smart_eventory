import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6', // Blue accent color
    },
    secondary: {
      main: '#10B981', // Green accent color
    },
    background: {
      default: '#F9FAFB', // Soft neutral background
      paper: '#FFFFFF', // Pure white for cards and main content
    },
    text: {
      primary: '#1F2937', // Darker gray for primary text
      secondary: '#6B7280', // Lighter gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    // ... define other typography variants as needed
  },
  shape: {
    borderRadius: 12, // Rounded corners (12px-16px)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Consistent rounded buttons
          textTransform: 'none', // Prevent uppercase by default
        },
        containedPrimary: {
          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2), 0 2px 4px rgba(59, 130, 246, 0.1)', // Subtle shadow
          '&:hover': {
            boxShadow: '0 6px 10px rgba(59, 130, 246, 0.3), 0 3px 6px rgba(59, 130, 246, 0.15)', // Larger shadow on hover
          },
        },
        containedSecondary: {
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2), 0 2px 4px rgba(16, 185, 129, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(16, 185, 129, 0.3), 0 3px 6px rgba(16, 185, 129, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Consistent rounded cards
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)', // Soft shadow for cards
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly less rounded inputs
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        notchedOutline: {
          borderColor: '#D1D5DB', // Subtle border color
        },
      },
    },
  },
});

export default theme;
