import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, RefreshCw, Trash2, Upload } from 'lucide-react';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED = { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] };

export default function ImageUploader({ file, onFile, onRemove, previewUrl, error, onError }) {
  const onDrop = React.useCallback((accepted, rejected) => {
    if (rejected?.length) {
      const rejection = rejected[0];
      const tooLarge = rejection.errors?.some((item) => item.code === 'file-too-large');
      onError(tooLarge ? 'Choose an image under 10 MB.' : 'Use a PNG, JPG, JPEG, or WebP image.');
      return;
    }
    if (accepted?.[0]) { onError(''); onFile(accepted[0]); }
  }, [onFile, onError]);
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED, maxSize: MAX_UPLOAD_BYTES, multiple: false, noClick: Boolean(file), noKeyboard: false,
  });
  return <div>
    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'dragging' : ''} ${file ? 'has-file' : ''}` })}>
      <input {...getInputProps({ 'aria-label': 'Choose an image file' })}/>
      {file && previewUrl ? <div className="upload-preview">
        <img src={previewUrl} alt={`Preview of ${file.name}`}/>
        <div className="upload-file-details"><span className="file-tag"><ImagePlus size={14}/>{file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}</span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB · ready to analyze</small></div>
      </div> : <div className="dropzone-empty">
        <div className="upload-icon"><Upload size={21}/></div>
        <strong>{isDragActive ? 'Drop your image here' : 'Drop an image to get started'}</strong>
        <span>or browse your device</span>
        <span className="file-types">PNG · JPG · JPEG · WebP <span aria-hidden="true">·</span> up to 10 MB</span>
      </div>}
    </div>
    {file && <div className="upload-actions"><button type="button" className="text-button" onClick={open}><RefreshCw size={15}/> Replace image</button><button type="button" className="text-button danger-text" onClick={onRemove}><Trash2 size={15}/> Remove</button></div>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;
}
