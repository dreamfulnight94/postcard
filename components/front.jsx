/* eslint-disable no-param-reassign */
/* eslint-disable react/no-this-in-sfc */
import * as React from 'react';
import { PhotoAlbum } from 'react-photo-album';
import clsx from 'clsx';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { Box, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCameraOutlined';

import useDebounce from '/src/hooks/useDebounce';
import { useSettings } from './front-display-setting';
import { previewLines } from '../../../utils/preview';

import '../index.css';
import MyEditor from './front-editor';
import AnimateButton from '/src/components/extended/animate-button';

const PhotoFrame = React.memo(
  React.forwardRef((props, ref) => {
    const { layoutOptions, imageProps, overlay, active, insertPosition, attributes, listeners } = props;
    const { alt, style, ...restImageProps } = imageProps;
    return (
      <div
        ref={ref}
        style={{
          width: overlay ? `calc(100% - ${2 * layoutOptions.padding}px)` : style.width,
          padding: style.padding,
          marginBottom: style.marginBottom,
          position: 'relative',
        }}
        className={clsx('photo-frame', {
          overlay,
          active,
          insertBefore: insertPosition === 'before',
          insertAfter: insertPosition === 'after',
        })}
        {...attributes}
        {...listeners}
      >
        <img
          alt={alt}
          style={{
            ...style,
            width: '100%',
            height: 'auto',
            padding: 0,
            marginBottom: 0,
          }}
          {...restImageProps}
        />
        {imageProps.title?.caption && (
          <div
            style={{
              paddingTop: '2px',
              overflow: 'hidden',
              whiteSpace: 'wrap',
              textAlign: 'center',
              position: 'absolute',
              bottom: '0px',
              backgroundColor: 'white',
              width: `calc(100% - ${2 * layoutOptions.padding}px)`,
              color: 'black',
              ...previewLines(2),
            }}
          >
            {imageProps.title.caption}
          </div>
        )}
      </div>
    );
  }),
);
PhotoFrame.displayName = 'PhotoFrame';

function SortablePhotoFrame(props) {
  const { photo, activeIndex } = props;
  const { attributes, listeners, isDragging, index, over, setNodeRef } = useSortable({ id: photo.id });

  return (
    <PhotoFrame
      ref={setNodeRef}
      active={isDragging}
      insertPosition={
        activeIndex !== undefined && over?.id === photo.id && !isDragging
          ? index > activeIndex
            ? 'after'
            : 'before'
          : undefined
      }
      aria-label="sortable image"
      attributes={attributes}
      listeners={listeners}
      {...props}
    />
  );
}

export default React.forwardRef((_, photoList) => {
  const renderRef = React.useRef(null);
  const [force, setForce] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const renderedPhotos = React.useRef({});
  const [activeId, setActiveId] = React.useState(null);
  // const [eheight, setEHeight] = React.useState(0);
  const debounce = useDebounce();
  const { layout, columns, spacing, padding, length, setLengthSetting } = useSettings();
  const activeIndex = activeId ? photoList.current.findIndex((photo) => photo.id === activeId) : undefined;

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     if (renderRef.current) {
  //       setEHeight((renderRef.current.offsetWidth * 4.1) / 5.8);
  //     }
  //   }, 300);
  // }, [length]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = React.useCallback(({ active }) => setActiveId(active.id), []);

  const handleDragEnd = React.useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photoList.current.findIndex((item) => item.id === active.id);
      const newIndex = photoList.current.findIndex((item) => item.id === over.id);
      photoList.current = arrayMove(photoList.current, oldIndex, newIndex);
      debounce(setForce(!force));
    }
  }, []);

  const renderPhoto = React.useCallback(
    (props) => {
      // capture rendered photos for future use in DragOverlay
      renderedPhotos.current[props.photo.id] = props;
      return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
    },
    [activeIndex],
  );

  const getResolution = (src, callback) => {
    const img = new Image();
    img.onload = function load() {
      callback(this.width, this.height);
    };
    img.onerror = function error() {
      callback(1, 1);
    };
    img.src = src;
  };

  const handleFileEvent = (e) => {
    const files = Array.prototype.slice.call(e.target.files);
    const totalNumberOfImage = photoList.current.length + files.length;
    setLengthSetting(totalNumberOfImage);
    files.forEach((file) => {
      getResolution(URL.createObjectURL(file), (width, height) => {
        photoList.current.push({
          src: URL.createObjectURL(file),
          originSrc: URL.createObjectURL(file),
          width,
          height,
          id: `${file.name}-${new Date().getTime()}`,
          title: null,
        });
        debounce(setForce(!force));
      });
    });
  };

  const handleClick = ({ photo }) => {
    setSelected(photo);
  };

  const handleClose = () => {
    setSelected(null);
  };

  const handleSave = (id, src, setting) => {
    const index = photoList.current.findIndex((photo) => photo.id === id);
    photoList.current[index].src = src;
    photoList.current[index].title = setting;
    debounce(setForce(!force));
  };

  const handleDelete = (id) => {
    photoList.current = photoList.current.filter((photo) => photo.id !== id);
    setLengthSetting(length - 1);
  };

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} />
        <AnimateButton>
          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: '#CA4C81', borderRadius: '20px', mt: 2 }}
            component="label"
          >
            <input hidden accept="image/*" capture="camera" multiple type="file" onChange={handleFileEvent} />
            <PhotoCamera />
            {' '}
            Add new image
          </Button>
        </AnimateButton>
        <Box flexGrow={1} />
      </Box>

      <MyEditor data={selected} onClose={handleClose} onSave={handleSave} onDelete={handleDelete} />
      <Box sx={{ m: 2 }}>
        {photoList.current.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className=""
          >
            <DragOverlay>{activeId && <PhotoFrame overlay {...renderedPhotos.current[activeId]} />}</DragOverlay>
            <SortableContext items={photoList.current}>
              <div style={{ width: '100%', border: '5px dashed #CA4C81', display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '2px', width: '100%' }} className="htmlToImageVis" ref={renderRef}>
                  <PhotoAlbum
                    photos={photoList.current}
                    layout={layout}
                    spacing={spacing}
                    padding={padding}
                    columns={columns}
                    renderPhoto={renderPhoto}
                    onClick={handleClick}
                    sizes={{
                      size: '600px',
                    }}
                  />
                </div>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div style={{ width: '100%', border: '5px dashed #CA4C81', height: '30vw' }} />
        )}
      </Box>
    </>
  );
});
