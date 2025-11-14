import { useEffect, useRef } from 'react';

export function useFlyToCart() {
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const flyToCart = (sourceEl: HTMLElement | null, targetEl: HTMLElement | null) => {
    if (!sourceEl || !targetEl || prefersReducedMotion.current) {
      return;
    }

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const comet = document.createElement('div');
    comet.className = 'fixed pointer-events-none z-[9999]';

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    comet.style.left = `${startX}px`;
    comet.style.top = `${startY}px`;
    comet.style.width = '20px';
    comet.style.height = '20px';

    const core = document.createElement('div');
    core.className = 'absolute inset-0 bg-white rounded-full shadow-[0_0_20px_8px_rgba(255,255,255,0.8)]';
    core.style.filter = 'blur(2px)';

    const tail = document.createElement('div');
    tail.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    tail.style.width = '60px';
    tail.style.height = '8px';
    tail.style.background = 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)';
    tail.style.borderRadius = '50%';
    tail.style.filter = 'blur(4px)';
    tail.style.transform = 'translate(-50%, -50%) rotate(0deg)';

    comet.appendChild(tail);
    comet.appendChild(core);
    document.body.appendChild(comet);

    const duration = 550 + Math.random() * 100;
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    tail.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    const animation = comet.animate(
      [
        {
          left: `${startX}px`,
          top: `${startY}px`,
          opacity: 1,
        },
        {
          left: `${endX}px`,
          top: `${endY}px`,
          opacity: 0.8,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      }
    );

    animation.onfinish = () => {
      comet.remove();
    };
  };

  return flyToCart;
}
