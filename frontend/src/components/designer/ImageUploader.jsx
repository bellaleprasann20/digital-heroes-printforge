
import React, { useRef, useState } from 'react';
import { FabricImage } from 'fabric';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({
  canvas,
  onImageAdded,
  onError,
  maxFileSize = MAX_FILE_SIZE,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!canvas) {
      setError('The design canvas is not ready.');
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please select a PNG, JPG or WebP image.');
      onError?.('Unsupported image format.');
      return;
    }

    if (file.size > maxFileSize) {
      setError(`Image must be smaller than ${Math.round(maxFileSize / 1024 / 1024)} MB.`);
      onError?.('Image file is too large.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Unable to read image file.'));
        reader.readAsDataURL(file);
      });

      const image = await FabricImage.fromURL(dataUrl);

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const maxWidth = canvasWidth * 0.65;
      const maxHeight = canvasHeight * 0.65;

      const scale = Math.min(
        maxWidth / image.width,
        maxHeight / image.height,
        1
      );

      image.set({
        left: (canvasWidth - image.width * scale) / 2,
        top: (canvasHeight - image.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        cornerStyle: 'circle',
        transparentCorners: false,
        objectCaching: true,
        name: file.name,
      });

      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();

      onImageAdded?.(image, file);
    } catch (err) {
      const message = err.message || 'Unable to add this image.';
      setError(message);
      onError?.(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFile}
        className="hidden"
      />

      <button
        type="button"
        onClick={openPicker}
        disabled={uploading || !canvas}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-primary)] bg-[var(--color-primary-light)] px-4 py-3 text-sm font-bold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary-light)]/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Adding image...' : '+ Choose image'}
      </button>

      <p className="mt-2 text-[10px] leading-5 text-[var(--color-muted)]">
        PNG, JPG or WebP · Maximum {Math.round(maxFileSize / 1024 / 1024)} MB
      </p>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
