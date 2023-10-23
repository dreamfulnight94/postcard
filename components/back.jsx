import React from 'react';
import { Box } from '@mui/material';
import BackForm from './back-form';
// import Editor from './back-editor';

export default function Back({ formik }) {
  return (
    <Box padding={2}>
      {/* <Editor onChange={onChange} text={message} /> */}
      <BackForm formik={formik} />
    </Box>
  );
}
