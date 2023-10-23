import * as React from 'react';
import * as htmlToImage from 'html-to-image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';
import postcalCodes from 'postal-codes-js';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';

import TabPanel from '/src/components/tab-panel';
import Front from './front';
import Back from './back';
import Settings from './front-display-setting';
import AnimateButton from '/src/components/extended/animate-button';

const sendAt = new Date();

export default function Composer({ onCreate }) {
  const [value, setValue] = React.useState(0);
  const photoList = React.useRef([]);
  const elder = useSelector((state) => state.team.elder);

  const formik = useFormik({
    initialValues: {
      sendAt: addDays(sendAt, 1),
      message: '',
      fname: '',
      lname: '',
      country: 'GB',
      city: '',
      postcode: '',
      address1: '',
      address2: '',
      streetNumber: '', 
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      message: Yup.string().required(),
      fname: Yup.string().required(),
      lname: Yup.string().required(),
      address1: Yup.string().required(),
      address2: Yup.string(),
      streetNumber: Yup.string().required(),
      country: Yup.string().required(),
      city: Yup.string().required(),
      postcode: Yup.string().required(),
      sendAt: Yup.date().required(),
    }),
  });

  React.useEffect(() => {
    formik.setValues({
      ...formik.values,
      fname: elder?.firstName || '',
      lname: elder?.lastName || '',
      address1: elder?.addressLine1 || '',
      address2: elder?.addressLine2 || '',
      streetNumber: elder?.streetNumber || '',
      city: elder?.town || '',
      postcode: elder?.zipCode || '',
    });
  }, [elder]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const exportAsPicture = (test = true) => {
    const element = document.getElementsByClassName('htmlToImageVis')[0];
    console.log('element', element);
    function urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buf) => new File([buf], filename, { type: mimeType }));
    }
    if (element) {
      htmlToImage
        .toPng(element)
        .then((dataUrl) => {
          urltoFile(dataUrl, 'hello.png').then((file) => {
            onCreate({
              test,
              file,
              ...formik.values,
            });
          });
        })
        .catch((error) => {
          console.error('Failed to convert HTML element to base64 string:', error);
        });
    } else {
      alert('Please add an image to the postcard');
    }
  };

  const handlePreview = async (test = true) => {
    const isValid = await formik.validateForm();
    console.log('valid', isValid)
    if (!Object.keys(isValid).length) {
      if (typeof postcalCodes.validate(formik.values.country, formik.values.postcode) === 'boolean') {
        exportAsPicture(test);
      } else {
        alert('Please input the correct postcode');
      }
    } else {
      alert('Please enter the details of the postcard');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 1 }}>      
      <Tabs indicatorColor="secondary" value={value} onChange={handleChange} aria-label="Vertical tabs example">
        <Box flexGrow={1} />
        <Tab
          icon={<AddAPhotoOutlinedIcon color="secondary" />}
          label={(
            <Typography variant="caption" color="secondary">
              Front
            </Typography>
          )}
          value={0}
        />
        <Tab
          icon={<LocalPostOfficeOutlinedIcon color="secondary" />}
          label={(
            <Typography variant="caption" color="secondary">
              Back
            </Typography>
          )}
          value={1}
        />
         <Box flexGrow={1} />
      </Tabs>      
      <Box sx={{ flexGrow: 1 }}>
        <TabPanel value={value} index={0}>
          <Settings>
            <Front ref={photoList} />
          </Settings>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Back formik={formik} />
        </TabPanel>
      </Box>    
      <Box display="flex">
        <Box flexGrow={1} />
        {value === 0 && (
          <>          
            <AnimateButton>
              <Button
                onClick={() => handlePreview()}
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: '#CA4C81', borderRadius: '20px', display: value === 0 ? 'flex' : 'none' }}
              >
                Preview
              </Button>
            </AnimateButton>
            <Box flexGrow={1} />
            <AnimateButton>
              <Button
                onClick={() => handlePreview(false)}
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: '#CA4C81', borderRadius: '20px' }}
              >
                Send
              </Button>
            </AnimateButton>
          </>
        )}       
        <Box flexGrow={1} />
      </Box>
    </Box>
  );
}
