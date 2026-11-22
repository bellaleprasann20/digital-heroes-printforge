
import React from 'react';

export default function DesignerToolbar({
  canvas,
  onAddText,
  onUploadImage,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  saving = false,
}) {
  const hasSelection = Boolean(canvas?.getActiveObject());

  const deleteSelected = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (activeObject.type === 'activeSelection') {
      activeObject.forEachObject((object) => canvas.remove(object));
    } else {
      canvas.remove(activeObject);
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const bringForward = () => {
    const object = canvas?.getActiveObject();
    if (!object) return;

    canvas.bringObjectForward(object);
    canvas.requestRenderAll();
  };

  const sendBackward = () => {
    const object = canvas?.getActiveObject();
    if (!object) return;

    canvas.sendObjectBackwards(object);
    canvas.requestRenderAll();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white p-3">
      <button
        type="button"
        onClick={onAddText}
        className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
      >
        + Add text
      </button>

      <button
        type="button"
        onClick={onUploadImage}
        className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-heading)] hover:border-[var(--color-primary)]"
      >
        ↑ Upload image
      </button>

      <span className="mx-1 hidden h-7 w-px bg-[var(--color-border)] sm:block" />

      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
        className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm font-bold disabled:opacity-30"
      >
        ↶
      </button>

      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
        className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm font-bold disabled:opacity-30"
      >
        ↷
      </button>

      <span className="mx-1 hidden h-7 w-px bg-[var(--color-border)] sm:block" />

      <button
        type="button"
        onClick={bringForward}
        disabled={!hasSelection}
        className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-xs font-semibold disabled:opacity-30"
      >
        Bring forward
      </button>

      <button
        type="button"
        onClick={sendBackward}
        disabled={!hasSelection}
        className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-xs font-semibold disabled:opacity-30"
      >
        Send backward
      </button>

      <button
        type="button"
        onClick={deleteSelected}
        disabled={!hasSelection}
        className="rounded-lg border border-red-200 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-30"
      >
        Delete
      </button>

      <div className="ml-auto">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !canvas}
          className="rounded-lg bg-[var(--color-heading)] px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save design'}
        </button>
      </div>
    </div>
  );
}
