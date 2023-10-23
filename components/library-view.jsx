import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import MainCard from '/src/components/cards/MainCard';
import AnimateButton from '/src/components/extended/animate-button';
import { useSearchParams } from 'react-router-dom';

function LibraryView({ postcard, onCancel }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleView = () => {
    setSearchParams({ ...searchParams, id: postcard.id });
  };

  return (
    <MainCard border content={false} sx={{ height: '100%', width: '100%' }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <img src={postcard.file?.path} alt="front" width="100%" height="100%" style={{ objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ p: 1 }}>
            <Typography>Sender</Typography>
            <Typography variant="subtitle1">
              <span>&nbsp;&nbsp;</span>
              {postcard.sender ? `${postcard.sender.fname} ${postcard.sender.lname}` : 'Unknown User'}
            </Typography>
            <br />
            <Typography>Sent On</Typography>
            <Typography variant="subtitle1">
              <span>&nbsp;&nbsp;</span>
              {format(new Date(postcard.sendAt), 'dd LLL yyyy')}
            </Typography>
            <br />
            <Box display="flex">
              <Box flexGrow={1} />
              <Box sx={{ flexGrow: 1 }}>
                <AnimateButton>
                  <Button
                    onClick={handleView}
                    variant="contained"
                    color="secondary"
                    sx={{ backgroundColor: '#CA4C81', borderRadius: '20px', width: '100%' }}
                  >
                    View
                  </Button>
                </AnimateButton>
              </Box>
              <Box flexGrow={1} />
              <Box flexGrow={1}>
                <AnimateButton sx={{ flexGrow: 1 }}>
                  <Button
                    onClick={() => onCancel(postcard.id)}
                    variant="contained"
                    color="secondary"
                    sx={{ backgroundColor: '#CA4C81', borderRadius: '20px', width: '100%' }}
                    disabled={( new Date() - new Date(postcard.sendAt) > 0 ) ? true : false }
                  >
                    Cancel
                  </Button>
                </AnimateButton>
              </Box>
              <Box flexGrow={1} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default LibraryView;
