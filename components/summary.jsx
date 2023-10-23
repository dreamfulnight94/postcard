import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {},
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  // backgroundColor: 'lightblue'
  // borderBottom: '1px solid ',
}));

export default function CustomAccordion({ expanded, question, answer, onExpand, index }) {
  return (
    <Accordion expanded={expanded} onChange={onExpand(index)}>
      <AccordionSummary aria-controls="panel1d-content">
        <Typography variant="subtitle2">{question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {answer.map((ans) => (
          <Box marginBottom="10px" key={ans}>
            {ans}
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
