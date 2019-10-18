import React from 'react';

import { ThemeProvider } from '@material-ui/styles';
// import AppTheme  from './containers/AppTheme';
import theme     from './config/theme';
import AppRouter from './routers/AppRouter';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
