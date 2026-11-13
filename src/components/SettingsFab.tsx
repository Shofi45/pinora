import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

export type TextSize = "normal" | "large" | "xlarge";

const OPTIONS: { value: TextSize; label: string; sample: number }[] = [
  { value: "normal", label: "Normal", sample: 15 },
  { value: "large", label: "Besar", sample: 19 },
  { value: "xlarge", label: "Sangat besar", sample: 23 },
];

/** Tombol pengaturan mengambang (di bawah tombol Fin AI) dengan pilihan ukuran teks. */
export function SettingsFab({
  textSize,
  onTextSize,
}: {
  textSize: TextSize;
  onTextSize: (s: TextSize) => void;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="settings-wrap" ref={box}>
      {open && (
        <div className="settings-pop" role="dialog" aria-label="Pengaturan">
          <div className="settings-head">
            <b>Pengaturan</b>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup pengaturan"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
          <p className="settings-label">Ukuran teks</p>
          <div
            className="size-options"
            role="radiogroup"
            aria-label="Ukuran teks"
          >
            {OPTIONS.map((o) => (
              <button
                key={o.value}
                role="radio"
                aria-checked={textSize === o.value}
                className={textSize === o.value ? "on" : ""}
                onClick={() => onTextSize(o.value)}
              >
                <span style={{ fontSize: o.sample }}>Aa</span>
                <small>{o.label}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className="settings-fab"
        onClick={() => setOpen(!open)}
        aria-label="Buka pengaturan"
        aria-expanded={open}
      >
        <Icon name="settings" size={22} />
      </button>
    </div>
  );
}
