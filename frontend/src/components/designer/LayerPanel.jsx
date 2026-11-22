
import React, { useCallback, useEffect, useState } from 'react';

function getObjectName(object, index) {
  if (object.name) return object.name;

  const type = object.type || 'object';

  if (['textbox', 'text', 'i-text'].includes(type)) {
    const text = (object.text || '').trim();
    return text ? text.slice(0, 24) : `Text ${index + 1}`;
  }

  if (type === 'image') return `Image ${index + 1}`;
  if (type === 'rect') return `Rectangle ${index + 1}`;
  if (type === 'circle') return `Circle ${index + 1}`;

  return `${type.charAt(0).toUpperCase()}${type.slice(1)} ${index + 1}`;
}

export default function LayerPanel({ canvas, selectedObject, onSelect }) {
  const [layers, setLayers] = useState([]);

  const refreshLayers = useCallback(() => {
    if (!canvas) {
      setLayers([]);
      return;
    }

    const objects = canvas.getObjects();

    setLayers(
      objects.map((object, index) => ({
        object,
        index,
        name: getObjectName(object, index),
        visible: object.visible !== false,
        locked: object.selectable === false,
      })).reverse()
    );
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    refreshLayers();

    const events = [
      'object:added',
      'object:removed',
      'object:modified',
      'selection:created',
      'selection:updated',
      'selection:cleared',
    ];

    events.forEach((event) => canvas.on(event, refreshLayers));

    return () => {
      events.forEach((event) => canvas.off(event, refreshLayers));
    };
  }, [canvas, refreshLayers]);

  const selectLayer = (object) => {
    if (!canvas) return;

    canvas.setActiveObject(object);
    canvas.requestRenderAll();
    onSelect?.(object);
    refreshLayers();
  };

  const toggleVisibility = (object) => {
    object.set('visible', object.visible === false);
    canvas?.requestRenderAll();
    refreshLayers();
  };

  const toggleLock = (object) => {
    const locked = object.selectable !== false;

    object.set({
      selectable: !locked,
      evented: !locked,
    });

    if (locked && canvas?.getActiveObject() === object) {
      canvas.discardActiveObject();
    }

    canvas?.requestRenderAll();
    refreshLayers();
  };

  const moveLayer = (object, direction) => {
    if (!canvas) return;

    if (direction === 'up') {
      canvas.bringObjectForward(object);
    } else {
      canvas.sendObjectBackwards(object);
    }

    canvas.requestRenderAll();
    refreshLayers();
  };

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h3 className="text-sm font-bold text-[var(--color-heading)]">
          Layers
        </h3>
        <span className="rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-muted)]">
          {layers.length} objects
        </span>
      </div>

      {layers.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[var(--color-heading)]">
            No layers yet
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Add text or upload artwork to get started.
          </p>
        </div>
      ) : (
        <div className="max-h-80 space-y-1 overflow-y-auto p-2">
          {layers.map(({ object, index, name, visible, locked }) => {
            const active = selectedObject === object;

            return (
              <div
                key={object.__uid || `${object.type}-${index}`}
                className={`flex items-center gap-2 rounded-lg p-2 transition ${active ? 'bg-[var(--color-primary-light)]' : 'hover:bg-[var(--color-background)]'}`}
              >
                <button
                  type="button"
                  onClick={() => selectLayer(object)}
                  className="min-w-0 flex-1 truncate text-left text-xs font-semibold text-[var(--color-heading)]"
                  title={name}
                >
                  <span className="mr-2 text-[var(--color-muted)]">
                    {object.type === 'image' ? '▧' : '◇'}
                  </span>
                  {name}
                </button>

                <button
                  type="button"
                  onClick={() => toggleVisibility(object)}
                  aria-label={visible ? 'Hide layer' : 'Show layer'}
                  title={visible ? 'Hide layer' : 'Show layer'}
                  className="rounded p-1.5 text-xs text-[var(--color-muted)] hover:bg-white"
                >
                  {visible ? '◉' : '○'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLock(object)}
                  aria-label={locked ? 'Unlock layer' : 'Lock layer'}
                  title={locked ? 'Unlock layer' : 'Lock layer'}
                  className="rounded p-1.5 text-xs text-[var(--color-muted)] hover:bg-white"
                >
                  {locked ? '🔒' : '⌑'}
                </button>

                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveLayer(object, 'up')}
                    title="Bring forward"
                    className="px-1 text-[10px] leading-3 text-[var(--color-muted)] hover:text-[var(--color-heading)]"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLayer(object, 'down')}
                    title="Send backward"
                    className="px-1 text-[10px] leading-3 text-[var(--color-muted)] hover:text-[var(--color-heading)]"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
