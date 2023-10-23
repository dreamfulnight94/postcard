import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { creatorDescr } from '../data';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AnimateButton from '/src/components/extended/animate-button';

function Filter({ children }) {
  return (
    <Grid item xs={24} sm={12} lg={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </Grid>
  );
}

function SliderControl({ name, min, max, step, value, onChange, disabled }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <FormControl margin="none" fullWidth>
      <InputLabel shrink variant="standard" focused={focused} color="secondary">
        {name}
      </InputLabel>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        size="small"
        color="secondary"
        valueLabelDisplay="auto"
        marks={[
          { value: min, label: `${min}` },
          { value: max, label: `${max}` },
        ]}
        onChange={(e, _value, activeThumb) => onChange(e, typeof _value === 'number' ? _value : _value[0], activeThumb)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{ mt: 2 }}
      />
    </FormControl>
  );
}

const SettingsContext = React.createContext(null);

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsContext');
  return context;
}

export default function Settings({ children }) {
  const [layout] = React.useState('columns');
  const [columns, setColumns] = React.useState(1);
  const [spacing, setSpacing] = React.useState(5);
  const [padding, setPadding] = React.useState(5);
  const [length, setLength] = React.useState(0);

  const settings = React.useMemo(
    () => ({
      layout,
      columns,
      spacing,
      padding,
      length,
      setLengthSetting: (value) => {
        setLength(value);
      },
    }),
    [layout, columns, spacing, padding, length],
  );

  React.useEffect(() => {
    if (length <= 1) setColumns(1);
    if (length > 1 && length <= 5) setColumns(2);
    if (length > 5) setColumns(3);
  }, [length]);
  
  const handleReset = () => {
    setSpacing(5);
    setPadding(5);
    setColumns(1);
  };
  
  return (
    <SettingsContext.Provider value={settings}>
      {children}
      <Box sx={{ p: 1 , textAlign: 'center' }}>
        <Typography variant="body" >{creatorDescr}</Typography>
      </Box>
      <Paper variant="outlined" sx={{ mb: 4, p: 2, textAlign: 'left' }}>
        <Grid container columns={24} rowSpacing={2} columnSpacing={4}>        
          <Filter>
            <SliderControl name="Spacing" min={0} max={50} value={spacing} onChange={(_, value) => setSpacing(value)} />
          </Filter>
          <Filter>
            <SliderControl name="Padding" min={0} max={50} value={padding} onChange={(_, value) => setPadding(value)} />
          </Filter>
          <Filter>
            <SliderControl
              name="Columns"
              min={1}
              max={10}
              value={columns}
              disabled={layout === 'rows'}
              onChange={(_, value) => setColumns(value)}
            />
          </Filter>       
          <Filter>
            <AnimateButton>
              <Button
                onClick={handleReset}
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: '#CA4C81', borderRadius: '20px', width: '100%' }}
              >
                Reset to default
              </Button>
            </AnimateButton>
          </Filter>
        </Grid>
      </Paper>
    </SettingsContext.Provider>
  );
}
