'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export default function BlobCursor({
  fillColor = '#4f46e5', // Nagar-Setu Indigo
  trailCount = 3,
  sizes = [45, 35, 25], 
  innerSizes = [10, 8, 6],
  opacities = [0.5, 0.4, 0.3],
  filterId = 'gooey-filter',
}) {
  const blobsRef = useRef([]);

  const handleMove = useCallback(
    e => {
      // Logic to follow the viewport
      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        gsap.to(el, {
          x: e.clientX,
          y: e.clientY,
          duration: isLead ? 0.15 : 0.4 + (i * 0.08),
          ease: isLead ? 'power2.out' : 'power1.out'
        });
      });
    },
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return (
    // pointer-events-none is crucial so you can still click buttons
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      
      {/* The "Gooey" SVG Filter */}
      <svg className="absolute w-0 h-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" 
            result="goo" 
          />
        </filter>
      </svg>

      {/* The Blobs Container */}
      <div style={{ filter: `url(#${filterId})` }} className="w-full h-full">
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={el => (blobsRef.current[i] = el)}
            className="fixed top-0 left-0 flex items-center justify-center will-change-transform"
            style={{
              width: sizes[i],
              height: sizes[i],
              backgroundColor: fillColor,
              opacity: opacities[i],
              borderRadius: '50%',
              marginLeft: -(sizes[i] / 2),
              marginTop: -(sizes[i] / 2),
            }}
          >
            {/* The Inner Dot */}
            <div
              className="rounded-full bg-white/30"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}