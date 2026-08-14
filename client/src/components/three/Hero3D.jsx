import { lazy, Suspense, useEffect, useState } from 'react';

const LuxuryScene = lazy(() => import('./LuxuryScene'));

function detectCanSupport3D() {
  if (typeof window === 'undefined') return false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Wraps LuxuryScene with capability detection + lazy loading so the
 * rest of the page never depends on WebGL. Falls back to a static
 * decorative gradient + lattice motif that still reads as premium.
 */
export default function Hero3D({ className }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(detectCanSupport3D());
  }, []);

  if (!enabled) {
    return (
      <div
        className={`relative overflow-hidden rounded-[var(--radius-bmw-lg)] bg-gradient-to-br from-beige via-cream to-gold-light/40 ${className || ''}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bmw-lattice-divider" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-beige via-cream to-gold-light/40 rounded-[var(--radius-bmw-lg)]" />
        }
      >
        <LuxuryScene />
      </Suspense>
    </div>
  );
}
