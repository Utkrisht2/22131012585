import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Link as MuiLink } from '@mui/material';
import Grid from '@mui/material/Grid';
import { urlService } from '../services/urlService';
import type { ShortenedUrl } from '../types/url.types';
import { Log } from '../lib/logging/logger';
import { format } from 'date-fns';

interface InputRow {
  id: number;
  longUrl: string;
  customShortcode: string;
  validity: string;
}

interface ResultRow {
  input: InputRow;
  result: { success: boolean; data?: ShortenedUrl; error?: string };
}

const UrlShortenerPage: React.FC = () => {
  const [inputs, setInputs] = useState<InputRow[]>([{ id: 1, longUrl: '', customShortcode: '', validity: '' }]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [globalError, setGlobalError] = useState('');

  const handleAddRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { id: Date.now(), longUrl: '', customShortcode: '', validity: '' }]);
      Log('frontend', 'info', 'page', 'Added a new URL input row.');
    }
  };

  const handleInputChange = (id: number, field: keyof Omit<InputRow, 'id'>, value: string) => {
    setInputs(inputs.map(input => (input.id === id ? { ...input, [field]: value } : input)));
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    setResults([]);
    Log('frontend', 'info', 'page', 'URL shortening process started.');

    const activeInputs = inputs.filter(input => input.longUrl.trim() !== '');
    if (activeInputs.length === 0) {
        setGlobalError('Please provide at least one URL to shorten.');
        Log('frontend', 'warn', 'page', 'User tried to submit with no URLs.');
        return;
    }

    const processedResults: ResultRow[] = [];
    let hasError = false;

    activeInputs.forEach(input => {
        if (!validateUrl(input.longUrl)) {
            processedResults.push({ input, result: { success: false, error: 'Invalid URL format.' } });
            Log('frontend', 'warn', 'page', `Invalid URL provided: ${input.longUrl}`);
            hasError = true;
            return;
        }

        const validityNum = input.validity ? parseInt(input.validity, 10) : 30;
        if (input.validity && isNaN(validityNum)) {
            processedResults.push({ input, result: { success: false, error: 'Validity must be a number.' } });
            Log('frontend', 'warn', 'page', `Invalid validity provided: ${input.validity}`);
            hasError = true;
            return;
        }

        const res = urlService.createShortUrl(
            input.longUrl,
            validityNum,
            input.customShortcode.trim() || undefined
        );
        processedResults.push({ input, result: res });
        if(!res.success) hasError = true;
    });

    setResults(processedResults);
    if (!hasError) {
        Log('frontend', 'info', 'page', 'All URLs processed successfully.');
    } else {
        Log('frontend', 'warn', 'page', 'Some URLs failed to process.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shorten URLs
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Enter up to 5 URLs to shorten. Default validity is 30 minutes.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} direction="column">
          {inputs.map((input, index) => (
            <Grid item key={input.id}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label={`Long URL #${index + 1}`} value={input.longUrl} onChange={e => handleInputChange(input.id, 'longUrl', e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth label="Custom Shortcode (optional)" value={input.customShortcode} onChange={e => handleInputChange(input.id, 'customShortcode', e.target.value)} helperText="4-10 alphanumeric chars" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth label="Validity (mins, optional)" type="number" value={input.validity} onChange={e => handleInputChange(input.id, 'validity', e.target.value)} helperText="Default: 30" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
          <Grid item container spacing={2} alignItems="center">
            <Grid item>
              <Button variant="contained" type="submit">Shorten URLs</Button>
            </Grid>
            <Grid item>
              <Button variant="text" onClick={handleAddRow} disabled={inputs.length >= 5}>Add Another URL</Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

      {globalError && <Alert severity="error" sx={{ mt: 2 }}>{globalError}</Alert>}
      
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>Results</Typography>
          {results.map(({ input, result }, index) => (
            <Alert key={index} severity={result.success ? 'success' : 'error'} sx={{ mb: 2, '& .MuiAlert-message': { width: '100%' } }}>
              <Typography variant="body2" sx={{wordBreak: 'break-all'}}>Original: {input.longUrl}</Typography>
              {result.success && result.data ? (
                <>
                  <Typography variant="body1">
                    Short URL:
                    <MuiLink href={`/${result.data.id}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {`${window.location.origin}/${result.data.id}`}
                    </MuiLink>
                  </Typography>
                  <Typography variant="caption">
                    Expires: {format(new Date(result.data.expiresAt), 'PPP p')}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Error: {result.error}</Typography>
              )}
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UrlShortenerPage;