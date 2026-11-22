
import React, { useEffect, useState } from 'react';

const DEFAULT_FONTS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Courier New', value: 'Courier New' },
];

export default function FontSelector({
  canvas,
  selectedObject,
  fonts = DEFAULT_FONTS,
  onFontChange,
}) {
  const [fontFamily, setFontFamily] = useState('Inter');

  useEffect(() => {
    if (selectedObject?.fontFamily) {
      setFontFamily(selectedObject.fontFamily);
    }
  }, [selectedObject]);

  const applyFont = async (value) => {
    setFontFamily(value);

    if (!canvas || !selectedObject) return;

    try {
      if (document.fonts?.load) {
        await document.fonts.load(`16px "${value}"`);
      }

      selectedObject.set('fontFamily', value);
      selectedObject.setCoords();
      canvas.requestRenderAll();

      onFontChange?.(value, selectedObject);
    } catch (error) {
      console.error('Font loading failed:', error);
    }
  };

  const isTextObject = selectedObject &&
    ['textbox', 'text', 'i-text'].includes(selectedObject.type);

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <h3 className="text-sm font-bold text-[var(--color-heading)]">
        Typography
      </h3>

      <label
        htmlFor="designer-font"
        className="mb-2 mt-4 block text-xs font-semibold text-[var(--color-text)]"
      >
        Font family
      </label>

      <select
        id="designer-font"
        value={fontFamily}
        onChange={(event) => applyFont(event.target.value)}
        disabled={!isTextObject}
        className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
      >
        {fonts.map((font) => {
          const value = typeof font === 'string' ? font : font.value;
          const label = typeof font === 'string' ? font : font.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <div
        className="mt-4 rounded-lg bg-[var(--color-background)] p-4 text-center text-xl"
        style={{ fontFamily }}
      >
        PrintForge Aa
      </div>

      {!isTextObject && (
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Select a text object to change its font.
        </p>
      )}
    </section>
  );
}
