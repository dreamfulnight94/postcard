import { Country, City } from 'country-state-city';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from '@mui/material';

import { MobileDatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';

function RecepientForm({ formik }) {
  return (
    <form onSubmit={formik.handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} sx={{ mb: '20px' }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="message"
              label="Message"
              color="secondary"
              variant="filled"
              value={formik.values.message}
              onChange={formik.handleChange}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="fname"
              color="secondary"
              variant="filled"
              value={formik.values.fname}
              onChange={formik.handleChange}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lname"
              variant="filled"
              color="secondary"
              value={formik.values.lname}
              onChange={formik.handleChange}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address 1"
              name="address1"
              color="secondary"
              variant="filled"
              value={formik.values.address1}
              onChange={formik.handleChange}
              error={formik.touched.address1 && Boolean(formik.errors.address1)}
              helperText={formik.touched.address1 && formik.errors.address1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address 2"
              name="address2"
              color="secondary"
              variant="filled"
              value={formik.values.address2}
              onChange={formik.handleChange}
              error={formik.touched.address2 && Boolean(formik.errors.address2)}
              helperText={formik.touched.address2 && formik.errors.address2}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Street Number"
              name="streetNumber"
              color="secondary"
              variant="filled"
              value={formik.values.streetNumber}
              onChange={formik.handleChange}
              error={formik.touched.streetNumber && Boolean(formik.errors.streetNumber)}
              helperText={formik.touched.streetNumber && formik.errors.streetNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formik.touched.country && formik.errors.country)}>
              <InputLabel htmlFor="country-selector" color="secondary">
                Country
              </InputLabel>
              <NativeSelect
                fullWidth
                id="country-selector"
                name="country"
                color="secondary"
                value={formik.values.country}
                onChange={formik.handleChange}
              >
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </NativeSelect>
              {formik.touched.country && Boolean(formik.errors.country) && (
                <FormHelperText error id="standard-country-helper-text">
                  {formik.errors.country}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(formik.touched.city && formik.errors.city)}>
              <InputLabel htmlFor="grouped-select">City</InputLabel>
              <NativeSelect
                fullWidth
                native
                id="city-selector"
                name="city"
                color="secondary"
                value={formik.values.city}
                onChange={formik.handleChange}
              >
                {City.getCitiesOfCountry(formik.values.country).map((city) => (
                  <option key={`${city.countryCode}-${city.stateCode}-${city.name}`} value={city.name}>
                    {formik.values.country === 'US' ? `${city.name}, ${city.stateCode}` : city.name}
                  </option>
                ))}
              </NativeSelect>
              {formik.touched.city && Boolean(formik.errors.city) && (
                <FormHelperText error id="standard-city-helper-text">
                  {formik.errors.city}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postcode"
              name="postcode"
              color="secondary"
              variant="filled"
              value={formik.values.postcode}
              onChange={formik.handleChange}
              error={formik.touched.postcode && Boolean(formik.errors.postcode)}
              helperText={formik.touched.postcode && formik.errors.postcode}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth error={Boolean(formik.touched.city && formik.errors.city)}>
              <MobileDatePicker
                renderInput={(props) => <TextField color="secondary" variant="filled" {...props} />}
                name="sendAt"
                label="Send on"
                color="secondary"
                value={formik.values.sendAt}
                onChange={(value) => {
                  formik.setFieldValue('sendAt', value, true);
                }}
                error={formik.touched.sendAt && Boolean(formik.errors.sendAt)}
                helperText={formik.touched.sendAt && formik.errors.sendAt}
                inputFormat="dd/MM/yyyy"
                minDate={addDays(new Date(), 1)}
              />
              <FormHelperText id="standard-sendAt-deliverytime-helper-text">
                Estimated delivery time is three working days
              </FormHelperText>
              {formik.touched.sendAt && Boolean(formik.errors.sendAt) && (
                <FormHelperText error id="standard-sendAt-helper-text">
                  {formik.errors.sendAt}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </form>
  );
}

export default RecepientForm;
