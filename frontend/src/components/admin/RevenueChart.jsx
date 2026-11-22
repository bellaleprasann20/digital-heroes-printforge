
import React, { useMemo, useState } from 'react';

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const PADDING = {
  top: 20,
  right: 20,
  bottom: 38,
  left: 65,
};

const formatCurrency = (value, currency) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: amount >= 100000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(amount);
};

const RevenueChart = ({
  data = [],
  loading = false,
  error = null,
  currency = 'INR',
  onRetry,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chart = useMemo(() => {
    const values = data.map((item) => Math.max(0, Number(item.revenue) || 0));
    const maxValue = Math.max(...values, 0);
    const chartMax = maxValue > 0 ? maxValue * 1.15 : 1;
    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const points = data.map((item, index) => {
      const x =
        data.length <= 1
          ? PADDING.left + plotWidth / 2
          : PADDING.left + (index / (data.length - 1)) * plotWidth;

      const y =
        PADDING.top + plotHeight - (values[index] / chartMax) * plotHeight;

      return {
        ...item,
        x,
        y,
        revenue: values[index],
      };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const baseline = CHART_HEIGHT - PADDING.bottom;
    const areaPath = points.length
      ? `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
      : '';

    const gridLines = Array.from({ length: 5 }, (_, index) => {
      const value = chartMax * (1 - index / 4);
      const y = PADDING.top + (plotHeight * index) / 4;
      return { value, y };
    });

    return {
      points,
      linePath,
      areaPath,
      gridLines,
      baseline,
      chartMax,
    };
  }, [data]);

  if (loading) {
    return (
      <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${className}`}>
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={`rounded-2xl border border-red-200 bg-red-50 p-6 ${className}`}>
        <p className="font-semibold text-red-700">Unable to load revenue data</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        )}
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Revenue overview
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Revenue across the selected reporting period.
          </p>
        </div>

        <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)]">
          {data.length} data points
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-center">
          <div>
            <p className="font-semibold text-[var(--color-heading)]">
              No revenue data available
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Revenue information will appear when data is available.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              role="img"
              aria-label="Revenue line chart"
              className="h-auto min-w-[520px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="printforge-revenue-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#C65D35" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#C65D35" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {chart.gridLines.map((line, index) => (
                <g key={index}>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={line.y}
                    y2={line.y}
                    stroke="currentColor"
                    opacity="0.12"
                    strokeDasharray="4 5"
                  />
                  <text
                    x={PADDING.left - 10}
                    y={line.y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    {formatCurrency(line.value, currency)}
                  </text>
                </g>
              ))}

              <path
                d={chart.areaPath}
                fill="url(#printforge-revenue-area)"
              />

              <path
                d={chart.linePath}
                fill="none"
                stroke="#C65D35"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chart.points.map((point, index) => (
                <g key={`${point.label || point.date || index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={activeIndex === index ? 7 : 4.5}
                    fill="#C65D35"
                    stroke="var(--color-surface)"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${point.label || point.date || 'Period'}: ${formatCurrency(point.revenue, currency)}`}
                  />

                  <text
                    x={point.x}
                    y={CHART_HEIGHT - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    {point.label || point.date || ''}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {activeIndex !== null && chart.points[activeIndex] && (
            <div className="mt-3 rounded-xl bg-[var(--color-surface-soft)] p-3 text-sm">
              <span className="text-[var(--color-muted)]">
                {chart.points[activeIndex].label || chart.points[activeIndex].date || 'Selected period'}
              </span>
              <span className="ml-2 font-bold text-[var(--color-heading)]">
                {formatCurrency(chart.points[activeIndex].revenue, currency)}
              </span>
              {chart.points[activeIndex].orders != null && (
                <span className="ml-2 text-[var(--color-muted)]">
                  · {chart.points[activeIndex].orders} orders
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default RevenueChart;
