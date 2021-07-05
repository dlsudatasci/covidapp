import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#EEF1FF',
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: '#00703c',
    },
    secondary: {
      main: '#6CC2B6',
      second: '#D4D4D4',
      third: '#EBEBEB',
      fourth: '#FFFFFF',
    },
    whiteButton: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#0A3243',
      secondary: '#212121',
    }
  },
  shadows,
  typography
});

export default theme;
