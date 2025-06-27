import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Collapse, Link as MuiLink
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { urlService } from '../services/urlService';
import type { ShortenedUrl } from '../types/url.types';
import type { ClickData } from '../types/url.types';
import { format } from 'date-fns';
import { Log } from '../lib/logging/logger';

const Row: React.FC<{ row: ShortenedUrl }> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const isExpired = new Date(row.expiresAt) < new Date();

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} disabled={row.clicks.length === 0}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <MuiLink href={`/${row.id}`} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 'bold' }}>
            {`${window.location.host}/${row.id}`}
          </MuiLink>
        </TableCell>
        <TableCell sx={{ wordBreak: 'break-all' }}>{row.longUrl}</TableCell>
        <TableCell align="center">{row.clicks.length}</TableCell>
        <TableCell>{format(new Date(row.createdAt), 'Pp')}</TableCell>
        <TableCell sx={{ color: isExpired ? 'error.main' : 'inherit' }}>
          {format(new Date(row.expiresAt), 'Pp')}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click History ({row.clicks.length} total)
              </Typography>
              {row.clicks.length > 0 ? (
                <Table size="small" aria-label="click history">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location (Mocked)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.clicks.map((historyRow: ClickData, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {format(new Date(historyRow.timestamp), 'PPP p')}
                        </TableCell>
                        <TableCell>{historyRow.source}</TableCell>
                        <TableCell>{historyRow.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                  <Typography>No clicks recorded yet.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const UrlStatisticsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    Log('frontend', 'info', 'page', 'UrlStatisticsPage mounted. Fetching data.');
    const allUrls = urlService.getAllUrls();
    allUrls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setUrls(allUrls);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, overflowX: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Statistics
      </Typography>
      {urls.length > 0 ? (
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expires At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <Row key={url.id} row={url} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{mt: 3, textAlign: 'center'}}>No shortened URLs found. Go create some!</Typography>
      )}
    </Paper>
  );
};

export default UrlStatisticsPage;