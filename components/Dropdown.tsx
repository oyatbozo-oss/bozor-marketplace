'use client';

import { useEffect, useRef, useState } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

// Вертикальный дропдаун: тап по кнопке раскрывает список вариантов.
export default function Dropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string | null;
  options: DropdownOption[];
  placeholder: string;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div className="dd" ref={ref}>
      <button type="button" className="dd-btn" onClick={() => setOpen((o) => !o)}>
        <span>{current ? `${current.icon ? current.icon + ' ' : ''}${current.label}` : placeholder}</span>
        <span className="dd-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="dd-menu">
          {options.map((o) => (
            <button
              type="button"
              key={o.value || '__all'}
              className={`dd-item ${o.value === value ? 'on' : ''}`}
              onClick={() => {
                onChange(o.value || null);
                setOpen(false);
              }}
            >
              {o.icon ? o.icon + ' ' : ''}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
