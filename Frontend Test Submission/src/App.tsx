import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import UrlShortenerPage from './pages/UrlShortenerPage';
import UrlStatisticsPage from './pages/UrlStatisticsPage';
import RedirectHandler from './components/RedirectHandler';
import { Log } from './lib/logging/logger';

// The layout component with navigation
const AppLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        URL Shortener
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        color="inherit"
                        variant={location.pathname === '/' ? 'outlined' : 'text'}
                    >
                        Shorten
                    </Button>
                    <Button
                        component={Link}
                        to="/stats"
                        color="inherit"
                        variant={location.pathname === '/stats' ? 'outlined' : 'text'}
                    >
                        Statistics
                    </Button>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {children}
            </Container>
        </Box>
    );
};

// The main App component
function App() {
  React.useEffect(() => {
    Log('frontend', 'info', 'component', 'App component mounted');
  }, []);

  return (
      <Routes>
        {/* Route for handling the redirection logic */}
        <Route path="/:shortcode" element={<RedirectHandler />} />

        {/* Routes for pages within the main layout */}
        <Route path="*" element={
            <AppLayout>
                <Routes>
                    <Route path="/" element={<UrlShortenerPage />} />
                    <Route path="/stats" element={<UrlStatisticsPage />} />
                    <Route path="*" element={
                        <Box sx={{textAlign: 'center', mt: 5}}>
                            <Typography variant="h4">404: Page Not Found</Typography>
                        </Box>
                    } />
                </Routes>
            </AppLayout>
        } />
      </Routes>
  );
}

export default App;