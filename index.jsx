import React from 'react';
import { Grid, Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Starter from './starter';
import CardCreator from './create';
import CardLibrary from './library';
import TabPanel from '/src/components/tab-panel';
import Preview from './components/preview';
import { createPostcard, getPostcards, setCurrent, getPostcardById, deletePostcardById } from '../../redux/postcard';
import { getElder } from '../../redux/team';
import mixpanel from 'mixpanel-browser';

function PostCard() {
  const [curr, setCurr] = React.useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getElder());
  }, []);

  React.useEffect(() => {
    if (curr === 1) {
      dispatch(getPostcards());
    }
  }, [curr]);

  const handleTabChange = (e, value) => {
    setCurr(value);
  };

  const handleCreate = (postcard) => {
    dispatch(createPostcard(postcard));
    mixpanel.track('Post-card send', {
        distinct_id: user.email,
    })
    setSearchParams({ ...searchParams, id: 'preview' });
  };

  const handleGetById = (id) => {
    dispatch(getPostcardById(id));
  };

  const handleReset = () => {
    dispatch(setCurrent());
  };

  const handleCancel = (id) => {
    dispatch(deletePostcardById(id));
  };

  return (
    <>
      <Grid container>
        <Grid item sm={9} xs={12}>
          <Tabs value={curr} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
            <Tab label="CREATE NEW POSTCARD" value={0} />
            <Tab label="ARCHIVE" value={1} />
          </Tabs>
          <TabPanel value={curr} index={0}>
            <CardCreator onCreate={handleCreate} />
          </TabPanel>
          <TabPanel value={curr} index={1}>
            <CardLibrary onCancel={handleCancel} />
          </TabPanel>
        </Grid>
        <Grid item sm={3} xs={12}>
          <Starter />
        </Grid>
      </Grid>
      <Preview onInit={handleGetById} onClose={handleReset} />
    </>
  );
}

export default PostCard;
