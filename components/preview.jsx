import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Box, Dialog, Link } from '@mui/material';
import Backdrop from '../../../components/backdrop';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function Preview({ onInit, onClose }) {
  const postcard = useSelector((state) => state.postcard.current);
  const loading = useSelector((state) => state.postcard.loading);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [open, setOpen] = React.useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  React.useEffect(() => {
    if (!id) {
      setOpen(false);
    } else {
      setOpen(true);
      if (id !== 'preview') {
        onInit(id);
      }
    }
  }, [id]);

  const handleClose = () => {
    onClose();
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  return (
    <Dialog open={open} fullWidth onClose={handleClose}>
      <Backdrop open={loading} />
      {postcard && (
        <>
          <Viewer fileUrl={postcard.pdf} plugins={[defaultLayoutPluginInstance]} />
          <Box display="flex" justifyContent="center">
            <Link href={postcard.pdf} target="_blank" color="secondary" underline="none">
              Isn&apos;t loading correctly?
            </Link>
          </Box>
        </>
      )}
    </Dialog>
  );
}

export default Preview;
