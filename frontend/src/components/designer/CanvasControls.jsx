
import React, { useEffect, useState } from 'react';

export default function CanvasControls({
  canvas,
  minZoom = 0.25,
  maxZoom = 3,
  onClear,
}) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvas) return;

    setZoom(canvas.getZoom());
  }, [canvas]);

  const applyZoom = (nextZoom) => {
    if (!canvas) return;

    const bounded = Math.min(maxZoom, Math.max(minZoom, nextZoom));

    canvas.setZoom(bounded);
    canvas.requestRenderAll();
    setZoom(bounded);
  };

  const zoomIn = () => applyZoom(zoom + 0.1);
  const zoomOut = () => applyZoom(zoom - 0.1);

  const resetZoom = () => {
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
    setZoom(1);
  };

  const centerDesign = () => {
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.centerObject(canvas.getActiveObject());
    canvas.requestRenderAll();
    setZoom(1);
  };

  const clearCanvas = () => {
    if (!canvas) return;

    const confirmed = window.confirm(
      'Remove all objects from this design? This action cannot be undone.'
    );

    if (!confirmed) return;

    canvas.discardActiveObject();
    canvas.getObjects().slice().forEach((object) => canvas.remove(object));
    canvas.requestRenderAll();
    onClear?.();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={zoomOut}
          disabled={!canvas || zoom <= minZoom}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-lg font-bold hover:bg-[var(--color-background)] disabled:opacity-30"
        >
          −
        </button>

        <span className="min-w-14 text-center text-xs font-bold tabular-nums text-[var(--color-heading)]">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={zoomIn}
          disabled={!canvas || zoom >= maxZoom}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-lg font-bold hover:bg-[var(--color-background)] disabled:opacity-30"
        >
          +
        </button>

        <button
          type="button"
          onClick={resetZoom}
          disabled={!canvas}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-background)] disabled:opacity-30"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={centerDesign}
          disabled={!canvas}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-background)] disabled:opacity-30"
        >
          Center view
        </button>

        <button
          type="button"
          onClick={clearCanvas}
          disabled={!canvas || canvas.getObjects().length === 0}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-30"
        >
          Clear design
        </button>
      </div>
    </div>
  );
}
