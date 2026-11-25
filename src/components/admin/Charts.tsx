import { useState } from "react";

const niceMax = (v: number) => {
  if (v <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p;
};

/** "2026-11-01" -> "01/11" */
export const shortDay = (iso: string) =>
  `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export interface Series {
  name: string;
  values: number[];
  color: string;
}

/** Grafik area halus, 1-2 seri, dengan tooltip saat disorot. */
export function AreaChart({
  labels,
  series,
  dark = false,
}: {
  labels: string[];
  series: Series[];
  dark?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640,
    H = 230,
    PL = 10,
    PR = 10,
    PT = 18,
    PB = 28;
  const n = labels.length;
  const max = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
  const x = (i: number) =>
    PL + (n <= 1 ? (W - PL - PR) / 2 : (i * (W - PL - PR)) / (n - 1));
  const y = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const base = H - PB;

  const smooth = (vals: number[]) => {
    const pts = vals.map((v, i) => [x(i), y(v)] as const);
    if (pts.length === 0) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)],
        p1 = pts[i],
        p2 = pts[i + 1],
        p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6,
        c1y = Math.min(base, Math.max(PT, p1[1] + (p2[1] - p0[1]) / 6));
      const c2x = p2[0] - (p3[0] - p1[0]) / 6,
        c2y = Math.min(base, Math.max(PT, p2[1] - (p3[1] - p1[1]) / 6));
      d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const step = Math.ceil(n / 7);
  const grid = [0, 0.5, 1];
  const gridColor = dark ? "rgba(255,255,255,.16)" : "#e4e9f2";
  const textColor = dark ? "rgba(255,255,255,.75)" : "#7a869a";
  const gid = `ag-${series.map((s) => s.color.replace(/\W/g, "")).join("")}-${dark ? "d" : "l"}`;

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Grafik garis"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          setHover(
            Math.max(
              0,
              Math.min(
                n - 1,
                Math.round(((px - PL) / (W - PL - PR)) * (n - 1)),
              ),
            ),
          );
        }}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient
              key={i}
              id={`${gid}-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor={s.color}
                stopOpacity={dark ? 0.35 : 0.28}
              />
              <stop offset="1" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {grid.map((g) => {
          const gy = PT + (1 - g) * (H - PT - PB);
          return (
            <g key={g}>
              <line
                x1={PL}
                x2={W - PR}
                y1={gy}
                y2={gy}
                stroke={gridColor}
                strokeDasharray="3 5"
              />
              <text x={PL} y={gy - 4} fontSize="11" fill={textColor}>
                {Math.round(max * g)}
              </text>
            </g>
          );
        })}
        {series.map((s, i) => (
          <g key={s.name}>
            <path
              d={`${smooth(s.values)} L${x(n - 1)},${base} L${x(0)},${base} Z`}
              fill={`url(#${gid}-${i})`}
            />
            <path
              d={smooth(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
        {labels.map(
          (l, i) =>
            (i % step === 0 || i === n - 1) && (
              <text
                key={l}
                x={x(i)}
                y={H - 8}
                fontSize="11"
                textAnchor="middle"
                fill={textColor}
              >
                {shortDay(l)}
              </text>
            ),
        )}
        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PT}
              y2={base}
              stroke={dark ? "rgba(255,255,255,.5)" : "#b8c2d4"}
              strokeDasharray="4 4"
            />
            {series.map((s) => (
              <circle
                key={s.name}
                cx={x(hover)}
                cy={y(s.values[hover])}
                r="5"
                fill={dark ? "#fff" : "#fff"}
                stroke={s.color}
                strokeWidth="3"
              />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="chart-tip"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > n * 0.7 ? "-105%" : "8px"})`,
          }}
        >
          <b>{shortDay(labels[hover])}</b>
          {series.map((s) => (
            <span key={s.name}>
              <i style={{ background: s.color }} />
              {s.name}: {s.values[hover].toLocaleString("id-ID")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Diagram batang vertikal sederhana. */
export function Bars({
  items,
  color = "var(--blue)",
}: {
  items: { label: string; value: number }[];
  color?: string;
}) {
  const max = niceMax(Math.max(0, ...items.map((i) => i.value)));
  const step = Math.ceil(items.length / 7);
  return (
    <div className="bars" role="img" aria-label="Diagram batang">
      {items.map((it, i) => (
        <div
          key={it.label + i}
          className="bars-col"
          title={`${shortDay(it.label)}: ${it.value}`}
        >
          <div className="bars-track">
            <span className="bars-val">{it.value > 0 ? it.value : ""}</span>
            <i
              style={{
                height: `${Math.max(it.value > 0 ? 6 : 2, (it.value / max) * 100)}%`,
                background: color,
                opacity: it.value > 0 ? 1 : 0.25,
              }}
            />
          </div>
          <small>{i % step === 0 ? shortDay(it.label) : ""}</small>
        </div>
      ))}
    </div>
  );
}

export interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Diagram donat dengan legenda. */
export function Donut({
  slices,
  centerLabel,
}: {
  slices: Slice[];
  centerLabel: string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const R = 52,
    C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 140 140" role="img" aria-label="Diagram donat">
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          stroke="#edf1f7"
          strokeWidth="18"
        />
        {total > 0 &&
          slices.map((s) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="18"
                strokeDasharray={`${Math.max(0, len - 2)} ${C - Math.max(0, len - 2)}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 70 70)"
              />
            );
            offset += len;
            return el;
          })}
        <text
          x="70"
          y="68"
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill="#064a91"
        >
          {total.toLocaleString("id-ID")}
        </text>
        <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#7a869a">
          {centerLabel}
        </text>
      </svg>
      <ul>
        {slices.map((s) => (
          <li key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
            <b>{total ? Math.round((s.value / total) * 100) : 0}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Batang horizontal berperingkat. */
export function HBars({
  items,
  color = "var(--blue)",
}: {
  items: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="hbars">
      {items.map((it) => (
        <li key={it.label}>
          <div>
            <span>{it.label}</span>
            <b>{it.value.toLocaleString("id-ID")}</b>
          </div>
          <div className="hbar">
            <i
              style={{ width: `${(it.value / max) * 100}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Batang mini untuk kartu ringkasan. */
export function Spark({
  values,
  color = "currentColor",
}: {
  values: number[];
  color?: string;
}) {
  const max = Math.max(1, ...values);
  const w = 100 / Math.max(1, values.length);
  return (
    <svg
      className="spark"
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {values.map((v, i) => {
        const h = Math.max(2, (v / max) * 30);
        return (
          <rect
            key={i}
            x={i * w + w * 0.18}
            y={32 - h}
            width={w * 0.64}
            height={h}
            rx="1.5"
            fill={color}
            opacity={v > 0 ? 0.9 : 0.25}
          />
        );
      })}
    </svg>
  );
}
