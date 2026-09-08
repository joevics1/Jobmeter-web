'use client';

import { useEffect, useRef, useId } from 'react';

interface AdsterraNativeProps {
  /** The container ID segment from the script URL, e.g. the
   * "1e2aa34112d35cbf5a5c237b9d086461" in
   * pl28382150.profitableratecpmnetwork.com/<this>/invoke.js */
  adKey: string;
  className?: string;
}

/**
 * Unlike AdsterraBanner, this format doesn't use the shared `atOptions`
 * global — it targets a specific container div by ID directly. Still built
 * to be safely reusable if the same adKey is ever placed twice on one page:
 * useId() gives each mounted instance its own unique container ID instead
 * of hardcoding the one from the snippet, so two instances never collide.
 */
export default function AdsterraNative({ adKey, className }: AdsterraNativeProps) {
  const reactId = useId().replace(/[:]/g, '');
  const containerId = `container-${adKey}-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl28382150.profitableratecpmnetwork.com/${adKey}/invoke.js`;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [adKey]);

  return <div ref={containerRef} id={containerId} className={className} />;
}
