/* eslint-disable */
import { Component } from 'react';
import ReactQuill from 'react-quill';
import { Box } from '@mui/material';
import 'quill-mention/dist/quill.mention.css';
import 'react-quill/dist/quill.snow.css';

class Editor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box sx={{ display: 'flex' }}>
        <ReactQuill value={this.props.text} onChange={this.props.onChange} style={{ flexGrow: 1, height: '100%' }} />
      </Box>
    );
  }
}

export default Editor;
