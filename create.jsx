import React from 'react';
import { Box } from '@mui/material';
import GetStarted from './components/instruction';
import Composer from './components/composer';

function CardCreator({ onCreate }) {
  const [showGuide, setShowGuide] = React.useState(true);

  const handleGetStarted = () => {
    setShowGuide(false);
  };
  return <Box>{showGuide ? <GetStarted onStart={handleGetStarted} /> : <Composer onCreate={onCreate} />}</Box>;
}

export default CardCreator;
