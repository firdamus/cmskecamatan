/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// --- horizontal stats visualizer ---
interface HorizontalBarChartProps {
  data: { label: string; value: number; color: string }[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const percentage = (item.value / maxValue) * 100;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-sans font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-900">{item.value} Komoditas</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- premium donut chart (full circle, per-segment colors) ---
interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerSub?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, rInner: number, start: number, end: number) {
  // clamp to avoid degenerate arcs
  const sweep = Math.min(end - start, 359.9999);
  const s1 = polarToCartesian(cx, cy, r, start);
  const e1 = polarToCartesian(cx, cy, r, start + sweep);
  const s2 = polarToCartesian(cx, cy, rInner, start + sweep);
  const e2 = polarToCartesian(cx, cy, rInner, start);
  const large = sweep > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, centerLabel, centerSub }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let acc = 0;

  const slices = data.map((item) => {
    const pct = total > 0 ? item.value / total : 0;
    const sweep = pct * 360;
    const start = acc;
    acc += sweep;
    return { ...item, pct: pct * 100, start, sweep };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
      <div className="relative w-44 h-44 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={arcPath(50, 50, 42, 26, slice.start, slice.start + slice.sweep)}
              fill={slice.color}
              className="transition-all duration-700"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
            />
          ))}
          {/* inner white circle */}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-sm font-black text-slate-800 leading-tight">{centerLabel || total.toLocaleString('id-ID')}</span>
          {centerSub && <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">{centerSub}</span>}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {slices.map((slice, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="font-medium text-slate-600">{slice.name}:</span>
            <span className="font-bold text-slate-800">
              {slice.value.toLocaleString('id-ID')} <span className="text-slate-400 font-normal">({slice.pct.toFixed(1)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- vertical bar chart ---
interface VerticalBarChartProps {
  data: { label: string; value: number; color?: string }[];
}

export const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-64 flex flex-col justify-between pt-4">
      {/* Chart grid and bars */}
      <div className="flex-1 flex items-end gap-3 sm:gap-6 border-b border-slate-200 pb-2">
        {data.map((item, idx) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 90 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none z-10 font-mono">
                {item.value.toLocaleString('id-ID')}
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t-md transition-all duration-1000 ease-out"
                style={{
                  height: `${heightPercent || 5}%`,
                  backgroundColor: item.color || '#3b82f6',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X Labels */}
      <div className="flex justify-between items-center pt-2 gap-3 sm:gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center">
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-pre-line leading-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
