import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { IconButton, Typography } from '@mui/material';

function Filter({ children, ...props }) {
  return (
    <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="center" {...props}>
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
          { value: min, label: <Typography color="secondary">{min}</Typography> },
          { value: max, label: <Typography color="secondary">{max}</Typography> },
        ]}
        onChange={(e, _value, activeThumb) => onChange(e, typeof _value === 'number' ? _value : _value[0], activeThumb)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{ mt: 1 }}
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
  const [caption, setCaption] = React.useState('');
  const [rotation, setRotation] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState();

  const handleReset = (data = {}) => {
    if (data.scale) setScale(data.scale);
    if (data.rotation) setRotation(data.rotation);
    if (data.caption) setCaption(data.caption);
    if (data.position) setPosition(data.position);
  };

  const handlePosition = (data) => {
    setPosition(data);
  };

  const settings = React.useMemo(
    () => ({
      caption,
      rotation,
      scale,
      position,
      handleReset,
      handlePosition,
    }),
    [rotation, scale, caption, position],
  );

  const handleRotate = (angle) => {
    let rotate = rotation + angle;
    if (rotate < 0) rotate += 360;
    setRotation(rotate);
  };

  return (
    <SettingsContext.Provider value={settings}>
      <Paper variant="outlined" sx={{ m: 4, p: 3, textAlign: 'left' }}>
        <Grid container rotation={24} rowSpacing={2} columnSpacing={4}>
          <Filter sm={12}>
            <TextField
              fullWidth
              label="Edit image"
              variant="standard"
              color="secondary"
              margin="none"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </Filter>

          <Filter>
            <SliderControl
              name="Scale"
              min={0.5}
              max={4}
              step={0.1}
              value={scale}
              onChange={(_, value) => setScale(value)}
            />
          </Filter>

          <Filter>
            <SliderControl
              name="Rotation"
              min={0}
              max={90}
              step={1}
              value={rotation}
              onChange={(_, value) => setRotation(value)}
            />
            <IconButton onClick={() => handleRotate(90)} color="secondary">
              <RotateRightIcon />
              {/* Right */}
            </IconButton>

            <IconButton onClick={() => handleRotate(-90)} color="secondary">
              <RotateLeftIcon />
              {/* Left */}
            </IconButton>
          </Filter>
        </Grid>
      </Paper>
      {children}
    </SettingsContext.Provider>
  );
}
