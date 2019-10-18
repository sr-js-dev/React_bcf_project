import React, { FunctionComponent } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

type AppThemeProps = {
  theme: Theme;
  children: any;
};

const AppTheme: FunctionComponent<AppThemeProps> = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
