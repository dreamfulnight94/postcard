import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import LibraryView from './components/library-view';

function Library({ onCancel }) {
  const postcards = useSelector((state) => state.postcard.postcards);

  return (
    <Grid container spacing={2}>
      {postcards.map((postcard) => (
        <Grid item xs={12} lg={6}>
          <LibraryView postcard={postcard} onCancel={onCancel} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Library;
