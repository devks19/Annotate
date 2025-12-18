// src/components/ui/StatCard.jsx
import React from 'react';

const COLOR_STYLES = {
  purple: {
    bg: 'bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-slate-950/80',
    border: 'border-violet-500/40',
    icon: 'bg-violet-500/20 text-violet-100',
    chip: 'text-violet-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-slate-950/80',
    border: 'border-emerald-500/40',
    icon: 'bg-emerald-500/20 text-emerald-100',
    chip: 'text-emerald-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-slate-950/80',
    border: 'border-sky-500/40',
    icon: 'bg-sky-500/20 text-sky-100',
    chip: 'text-sky-100',
  },
};

export default function StatCard({ title, value, icon: Icon, color = 'purple' }) {
  const palette = COLOR_STYLES[color] || COLOR_STYLES.purple;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-3xl
        ${palette.bg} ${palette.border}
        border shadow-[0_18px_35px_rgba(15,23,42,0.75)]
        transition-transform transition-shadow duration-200
        hover:-translate-y-0.5 hover:shadow-[0_24px_45px_rgba(15,23,42,0.9)]
      `}
    >
      {/* soft inner highlight */}
      <div className="pointer-events-none absolute inset-px rounded-3xl bg-gradient-to-br from-white/7 via-transparent to-transparent opacity-70" />

      {/* animated glow on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

      <div className="relative flex h-full flex-col justify-between p-4 md:p-5 gap-3">
        {/* Title + chip */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-100/90">{title}</p>
          <span
            className={`
              inline-flex items-center rounded-full border border-white/15
              bg-black/25 px-2 py-0.5 text-[10px] font-medium
              ${palette.chip}
            `}
          >
            All time
          </span>
        </div>

        {/* Value + icon */}
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-semibold text-white leading-none">
              {value}
            </span>
            <span className="mt-1 text-[11px] text-slate-200/70">
              Updated just now
            </span>
          </div>

          {Icon && (
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-2xl
                ${palette.icon}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
