
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import PrintAreaOverlay from './PrintAreaOverlay';

export default function DesignCanvas({
  width = 1200,
  height = 800,
  backgroundColor = '#ffffff',
  printArea = { x: 5, y: 5, width: 90, height: 90 },
  bleed = 3,
  onCanvasReady,
  onSelectionChange,
  onModified,
  className = '',
}) {
  const elementRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const canvas = new Canvas(elementRef.current, {
      width,
      height,
      backgroundColor,
      preserveObjectStacking: true,
      selection: true,
      stopContextMenu: true,
      fireRightClick: false,
      renderOnAddRemove: true,
    });

    canvasRef.current = canvas;

    const handleSelection = (event) => {
      const selected = event.selected?.[0] || canvas.getActiveObject() || null;
      onSelectionChange?.(selected);
    };

    const handleClear = () => onSelectionChange?.(null);
    const handleModified = (event) => onModified?.(event.target || null);

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleClear);
    canvas.on('object:modified', handleModified);

    setReady(true);
    onCanvasReady?.(canvas);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleClear);
      canvas.off('object:modified', handleModified);

      canvasRef.current = null;
      setReady(false);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setDimensions({ width, height });
    canvas.backgroundColor = backgroundColor;
    canvas.requestRenderAll();
  }, [width, height, backgroundColor]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative mx-auto overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <canvas ref={elementRef} />

        {ready && (
          <PrintAreaOverlay
            printArea={printArea}
            bleed={bleed}
          />
        )}
      </div>

      <p className="mt-3 text-center text-[10px] text-[var(--color-muted)]">
        {width} × {height} px · {ready ? 'Canvas ready' : 'Preparing canvas'}
      </p>
    </div>
  );
}
