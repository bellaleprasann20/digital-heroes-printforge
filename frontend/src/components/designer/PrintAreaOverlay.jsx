
import React from 'react';

export default function PrintAreaOverlay({
  printArea = { x: 5, y: 5, width: 90, height: 90 },
  bleed = 3,
  showBleed = true,
  showSafeArea = true,
}) {
  const clamp = (value) => Math.min(100, Math.max(0, Number(value) || 0));

  const x = clamp(printArea.x);
  const y = clamp(printArea.y);
  const width = clamp(printArea.width);
  const height = clamp(printArea.height);

  const bleedX = clamp(x - bleed);
  const bleedY = clamp(y - bleed);
  const bleedWidth = clamp(width + bleed * 2);
  const bleedHeight = clamp(height + bleed * 2);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {showBleed && (
        <div
          className="absolute border border-dashed border-orange-500/80"
          style={{
            left: `${bleedX}%`,
            top: `${bleedY}%`,
            width: `${bleedWidth}%`,
            height: `${bleedHeight}%`,
          }}
        >
          <span className="absolute left-1 top-1 rounded bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            Bleed
          </span>
        </div>
      )}

      {showSafeArea && (
        <div
          className="absolute border-2 border-dashed border-emerald-500/90"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${width}%`,
            height: `${height}%`,
          }}
        >
          <span className="absolute bottom-1 right-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            Safe print area
          </span>
        </div>
      )}
    </div>
  );
}
