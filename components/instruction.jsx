import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { getStartedDescr } from '../data';

function GetStarted({ onStart }) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ height: '20px' }} />
      <Typography variant="body">{getStartedDescr}</Typography>
      <Box sx={{ height: '20px' }} />
      <Button variant="contained" sx={{ borderRadius: '20px' }} color="secondary" onClick={onStart}>
        Get Started
      </Button>
    </Box>
  );
}

export default GetStarted;
