
import React, { useEffect, useState } from 'react';

const PRESET_COLORS = [
  '#171717',
  '#ffffff',
  '#e85d3f',
  '#f4a340',
  '#e8c547',
  '#25845b',
  '#277da1',
  '#6650a4',
  '#d94878',
  '#8b5e3c',
];

export default function ColorPicker({
  canvas,
  selectedObject,
  property = 'fill',
  label = 'Color',
  colors = PRESET_COLORS,
  onColorChange,
}) {
  const [color, setColor] = useState('#171717');

  useEffect(() => {
    if (!selectedObject) return;

    const current = selectedObject.get(property);

    if (typeof current === 'string' && /^#[0-9a-f]{6}$/i.test(current)) {
      setColor(current);
    }
  }, [selectedObject, property]);

  const applyColor = (nextColor) => {
    setColor(nextColor);

    if (!canvas || !selectedObject) return;

    selectedObject.set(property, nextColor);
    selectedObject.setCoords();
    canvas.requestRenderAll();

    onColorChange?.(nextColor, selectedObject);
  };

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <h3 className="text-sm font-bold text-[var(--color-heading)]">
        {label}
      </h3>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(event) => applyColor(event.target.value)}
          aria-label={`Choose ${label.toLowerCase()}`}
          className="h-11 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
        />

        <input
          type="text"
          value={color.toUpperCase()}
          onChange={(event) => {
            const value = event.target.value;

            if (/^#[0-9a-fA-F]{6}$/.test(value)) {
              applyColor(value);
            } else {
              setColor(value);
            }
          }}
          onBlur={() => {
            if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
              setColor('#171717');
            }
          }}
          maxLength={7}
          aria-label={`${label} hex value`}
          className="h-11 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] px-3 font-mono text-xs outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {colors.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => applyColor(item)}
            title={item}
            aria-label={`Select color ${item}`}
            className={`aspect-square rounded-lg border transition hover:scale-105 ${color.toLowerCase() === item.toLowerCase() ? 'border-[var(--color-heading)] ring-2 ring-[var(--color-primary)] ring-offset-2' : 'border-black/10'}`}
            style={{ backgroundColor: item }}
          />
        ))}
      </div>

      {!selectedObject && (
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Select an object on the canvas to apply this color.
        </p>
      )}
    </section>
  );
}
