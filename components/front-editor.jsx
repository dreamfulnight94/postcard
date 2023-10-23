import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Box, Dialog, DialogTitle, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Settings, { useSettings } from './front-editor-setting';

const PhotoEditor = React.forwardRef(({ data }, ref) => {
  const context = useSettings();
  const { scale, rotation, borderRadius, position, handlePosition } = context;
  React.useEffect(() => {
    ref.current.setting = context;
  }, [context]);

  React.useEffect(() => {
    if (data?.title) {
      context.handleReset(data.title);
    }
  }, [data]);

  const handlePositionChange = (_position) => {
    handlePosition(_position);
  };

  return (
    <AvatarEditor
      ref={ref}
      image={data?.originSrc}
      width={data?.width}
      height={data?.height}
      scale={scale}
      borderRadius={borderRadius}
      rotate={rotation}
      position={position}
      onPositionChange={handlePositionChange}
      disableBoundaryChecks
      className="avatar-editor"
    />
  );
});

function MyEditor({ data, onClose, onSave, onDelete }) {
  const editor = React.useRef(null);

  const handleSave = async () => {
    const dataUrl = editor.current.getImage().toDataURL();
    onSave(data.id, dataUrl, editor.current.setting);
    onClose();
  };

  const handleDelete = () => {
    onDelete(data.id);
    onClose();
  };

  return (
    <Dialog open={data || false} onClose={onClose} maxWidth='md'>
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleSave}>
          <DoneOutlineOutlinedIcon color="secondary" />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteOutlineOutlinedIcon color="secondary" />
        </IconButton>
        <Box flexGrow={1} />
        {onClose ? (
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        ) : null}
        <br />
        <Divider />
      </DialogTitle>
      <Settings>
        <Box display="flex" justifyContent="center">
          <PhotoEditor data={data} ref={editor} />
        </Box>
      </Settings>
    </Dialog>
  );
}

export default MyEditor;
