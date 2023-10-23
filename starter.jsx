import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomAccordion from './components/summary';
import { starterTitle, starterDescr, FAQS } from './data';

function Starter() {
  const [expanded, setExpanded] = React.useState({});
  const handleChange = (panel) => (_event, newExpanded) => {
    setExpanded({ ...expanded, [panel]: newExpanded });
  };
  return (
    <Box sx={{}}>
      <Box sx={{ m: '10px' }}>
        <Typography variant="h2" className="color-emph">
          {starterTitle}
        </Typography>
        <Typography variant="caption" textAlign="justify">
          {starterDescr}
        </Typography>
      </Box>
      {FAQS.map((qa, index) => (
        <CustomAccordion
          expanded={expanded[index]}
          onExpand={handleChange}
          question={qa[0]}
          answer={qa[1]}
          index={index}
          key={qa[0]}
        />
      ))}
    </Box>
  );
}

export default Starter;
