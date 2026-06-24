'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Gallery({
  urls,
  fallback,
}: {
  urls: string[];
  fallback: string;
}) {
  const [idx, setIdx] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="detail-hero" style={{ background: fallback }}>
        <Link className="back" href="/">
          ←
        </Link>
        📱
      </div>
    );
  }

  return (
    <div className="gallery">
      <Link className="back" href="/">
        ←
      </Link>
      <div
        className="gallery-track"
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== idx) setIdx(i);
        }}
      >
        {urls.map((u, i) => (
          <div
            className="gallery-slide"
            key={i}
            style={{ backgroundImage: `url(${u})` }}
          />
        ))}
      </div>
      {urls.length > 1 && (
        <>
          <div className="gallery-count">
            {idx + 1}/{urls.length}
          </div>
          <div className="gallery-dots">
            {urls.map((_, i) => (
              <span key={i} className={i === idx ? 'on' : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
