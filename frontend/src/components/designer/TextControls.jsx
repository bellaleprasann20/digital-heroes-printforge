
import React, { useEffect, useState } from 'react';

export default function TextControls({ canvas, selectedObject }) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(36);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textAlign, setTextAlign] = useState('left');
  const [charSpacing, setCharSpacing] = useState(0);

  useEffect(() => {
    if (!selectedObject || !['textbox', 'text', 'i-text'].includes(selectedObject.type)) {
      setText('');
      return;
    }

    setText(selectedObject.text || '');
    setFontSize(selectedObject.fontSize || 36);
    setFontWeight(selectedObject.fontWeight || 'normal');
    setFontStyle(selectedObject.fontStyle || 'normal');
    setTextAlign(selectedObject.textAlign || 'left');
    setCharSpacing(selectedObject.charSpacing || 0);
  }, [selectedObject]);

  const update = (properties) => {
    if (!canvas || !selectedObject) return;

    selectedObject.set(properties);
    selectedObject.setCoords();
    canvas.requestRenderAll();
  };

  const isTextObject = selectedObject &&
    ['textbox', 'text', 'i-text'].includes(selectedObject.type);

  if (!isTextObject) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
        <h3 className="text-sm font-bold text-[var(--color-heading)]">
          Text properties
        </h3>
        <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
          Select a text object on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
      <h3 className="text-sm font-bold text-[var(--color-heading)]">
        Text properties
      </h3>

      <div>
        <label className="mb-2 block text-xs font-semibold text-[var(--color-text)]">
          Text content
        </label>
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            update({ text: event.target.value });
          }}
          rows={3}
          className="w-full resize-y rounded-lg border border-[var(--color-border)] p-3 text-sm outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--color-text)]">
            Font size
          </label>
          <span className="text-xs font-bold text-[var(--color-heading)]">
            {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="6"
          max="300"
          value={fontSize}
          onChange={(event) => {
            const value = Number(event.target.value);
            setFontSize(value);
            update({ fontSize: value });
          }}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            const value = fontWeight === 'bold' ? 'normal' : 'bold';
            setFontWeight(value);
            update({ fontWeight: value });
          }}
          className={`rounded-lg border p-2.5 text-sm font-bold ${fontWeight === 'bold' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]'}`}
        >
          B Bold
        </button>

        <button
          type="button"
          onClick={() => {
            const value = fontStyle === 'italic' ? 'normal' : 'italic';
            setFontStyle(value);
            update({ fontStyle: value });
          }}
          className={`rounded-lg border p-2.5 text-sm italic ${fontStyle === 'italic' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]'}`}
        >
          I Italic
        </button>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-[var(--color-text)]">
          Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['left', 'center', 'right'].map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => {
                setTextAlign(alignment);
                update({ textAlign: alignment });
              }}
              className={`rounded-lg border px-2 py-2 text-xs font-semibold capitalize ${textAlign === alignment ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)]'}`}
            >
              {alignment}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--color-text)]">
            Letter spacing
          </label>
          <span className="text-xs text-[var(--color-muted)]">{charSpacing}</span>
        </div>
        <input
          type="range"
          min="-100"
          max="500"
          step="10"
          value={charSpacing}
          onChange={(event) => {
            const value = Number(event.target.value);
            setCharSpacing(value);
            update({ charSpacing: value });
          }}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>
    </section>
  );
}
