import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import DesignCanvas from '../../components/designer/DesignCanvas';
import DesignerToolbar from '../../components/designer/DesignerToolbar';
import TextControls from '../../components/designer/TextControls';
import ImageUploader from '../../components/designer/ImageUploader';
import ColorPicker from '../../components/designer/ColorPicker';
import FontSelector from '../../components/designer/FontSelector';
import LayerPanel from '../../components/designer/LayerPanel';
import CanvasControls from '../../components/designer/CanvasControls';

export default function DesignEditor({
  design = null,
  product = null,
  loading = false,
  saving = false,
  error = '',
  onSave,
  onBack,
}) {
  const { designId } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!canvas) return;

    const refreshLayers = () => {
      setObjects([...canvas.getObjects()]);
      setSelectedObject(canvas.getActiveObject() || null);
    };

    canvas.on('object:added', refreshLayers);
    canvas.on('object:removed', refreshLayers);
    canvas.on('selection:created', refreshLayers);
    canvas.on('selection:updated', refreshLayers);
    canvas.on('selection:cleared', refreshLayers);
    canvas.on('object:modified', refreshLayers);

    refreshLayers();

    return () => {
      canvas.off('object:added', refreshLayers);
      canvas.off('object:removed', refreshLayers);
      canvas.off('selection:created', refreshLayers);
      canvas.off('selection:updated', refreshLayers);
      canvas.off('selection:cleared', refreshLayers);
      canvas.off('object:modified', refreshLayers);
    };
  }, [canvas]);

  const handleSave = async () => {
    if (!canvas || typeof onSave !== 'function') {
      setSaveMessage('Design save service is not connected yet.');
      return;
    }

    try {
      setSaveMessage('');

      const designData = {
        designId: design?.id || design?._id || designId || null,
        productId: product?.id || product?._id || design?.productId || null,
        name: design?.name || `${product?.name || 'Print'} design`,
        canvas: canvas.toJSON(['__uid', 'selectable', 'evented']),
        dimensions: {
          width: canvas.getWidth(),
          height: canvas.getHeight(),
        },
      };

      await onSave(designData);
      setSaveMessage('Design saved successfully.');
    } catch (err) {
      setSaveMessage(err?.message || 'Unable to save your design.');
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-800">{error}</p>
        <Link to="/account/designs" className="mt-3 inline-block text-sm font-bold text-red-800 underline">
          Back to designs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            to="/account/designs"
            onClick={onBack}
            className="text-sm font-semibold text-[#b85f39] hover:underline"
          >
            ← My designs
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--color-heading)]">
            Design editor
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {product?.name || design?.productName || 'Custom print artwork'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !canvas}
          className="rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save design'}
        </button>
      </header>

      {saveMessage && (
        <p role="status" className="rounded-xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
          {saveMessage}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] p-3">
            <DesignerToolbar
              canvas={canvas}
              onSave={handleSave}
            />
          </div>

          <div className="min-h-[420px] overflow-auto bg-[#e9e8e4] p-4 sm:p-8">
            <div className="mx-auto w-fit max-w-full shadow-xl">
              <DesignCanvas
  width={Number(product?.canvasWidth) || design?.designData?.dimensions?.width || 1200}
  height={Number(product?.canvasHeight) || design?.designData?.dimensions?.height || 800}
  printArea={product?.printArea}
  onCanvasReady={setCanvas}
  onSelectionChange={setSelectedObject}
/>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] p-3">
            <CanvasControls canvas={canvas} />
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-heading)]">
              Text settings
            </h2>
            <TextControls
              canvas={canvas}
              selectedObject={selectedObject}
            />
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-heading)]">
              Font
            </h2>
            <FontSelector
              canvas={canvas}
              selectedObject={selectedObject}
            />
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-heading)]">
              Colour
            </h2>
            <ColorPicker
              canvas={canvas}
              selectedObject={selectedObject}
            />
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-heading)]">
              Add artwork
            </h2>
            <ImageUploader canvas={canvas} />
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h2 className="mb-4 text-sm font-bold text-[var(--color-heading)]">
              Layers
            </h2>
            <LayerPanel
              canvas={canvas}
              objects={objects}
              selectedObject={selectedObject}
            />
          </section>
        </aside>
      </div>

      <p className="text-xs leading-6 text-[var(--color-muted)]">
        Keep important artwork inside the marked print-safe area. Final
        artwork dimensions, bleed, resolution, and file validation are
        checked by the production service before printing.
      </p>
    </div>
  );
}