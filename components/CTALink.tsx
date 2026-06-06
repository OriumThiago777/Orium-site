'use client';

interface CTALinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  label?: string;
  target?: string;
  rel?: string;
}

export default function CTALink({ href, className, children, label, target = '_blank', rel = 'noopener noreferrer' }: CTALinkProps) {
  function trackCTA() {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'cta_click', { event_category: 'CTA', event_label: label || href });
    }
    console.log('[ORIUM CTA]', label || href);
  }
  return (
    <a href={href} target={target} rel={rel} className={className} onClick={trackCTA}>
      {children}
    </a>
  );
}
