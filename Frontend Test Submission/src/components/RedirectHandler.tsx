import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlService } from '../services/urlService';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import { Log } from '../lib/logging/logger';

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    Log('frontend', 'info', 'component', `RedirectHandler mounted for shortcode: ${shortcode}`);
    if (!shortcode) {
      navigate('/');
      return;
    }

    const urlData = urlService.getUrlByShortcode(shortcode);
    if (urlData) {
      const isExpired = new Date(urlData.expiresAt) < new Date();
      if (isExpired) {
        Log('frontend', 'warn', 'page', `Attempted to access expired shortcode: ${shortcode}`);
        setError('This link has expired.');
      } else {
        urlService.recordClick(shortcode);
        Log('frontend', 'info', 'page', `Redirecting ${shortcode} to ${urlData.longUrl}`);
        window.location.replace(urlData.longUrl);
      }
    } else {
      Log('frontend', 'error', 'page', `Shortcode not found: ${shortcode}`);
      setError('This link does not exist or has been removed.');
    }
  }, [shortcode, navigate]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10, p: 3 }}>
        <Typography variant="h4" color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>Go Home</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Redirecting, please wait...</Typography>
    </Box>
  );
};

export default RedirectHandler;