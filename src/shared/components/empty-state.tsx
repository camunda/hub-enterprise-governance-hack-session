import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';

/**
 * Unified Empty State — the four-part teaching moment.
 *
 * Every empty surface in the app uses this component. The tone is:
 * "Nothing here yet — but here's what this becomes."
 *
 * Structure:
 *   [Icon — 80px, orange-accented]
 *   [Headline — 24pt semibold]
 *   [Story — 2-3 lines explaining what this surface IS]
 *   [Primary CTA] [Secondary link]
 */

interface EmptyStateCta {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
}

interface EmptyStateProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly headline: string;
  readonly story: string;
  readonly primaryCta?: EmptyStateCta;
  readonly secondaryCta?: EmptyStateCta;
  /** Size variant — 'page' for full-page empty states, 'section' for inline. */
  readonly variant?: 'page' | 'section';
}

export function EmptyState({
  icon: Icon,
  headline,
  story,
  primaryCta,
  secondaryCta,
  variant = 'section',
}: EmptyStateProps) {
  const isPage = variant === 'page';

  return (
    <div
      className={`flex flex-col items-center gap-5 text-center ${
        isPage ? 'py-20 px-8' : 'py-10 px-6'
      }`}
    >
      {/* Icon */}
      <div className="flex size-20 items-center justify-center rounded-2xl bg-[var(--surface-orange)]/60">
        <Icon className="size-9 text-[var(--camunda-orange)]/80" />
      </div>

      {/* Headline */}
      <h3
        className={`font-bold tracking-tight ${
          isPage ? 'text-2xl' : 'text-lg'
        }`}
      >
        {headline}
      </h3>

      {/* Story */}
      <p
        className={`max-w-md leading-relaxed text-muted-foreground ${
          isPage ? 'text-base' : 'text-sm'
        }`}
      >
        {story}
      </p>

      {/* Actions */}
      {(primaryCta || secondaryCta) && (
        <div className="flex items-center gap-4 pt-2">
          {primaryCta && (
            <CtaButton cta={primaryCta} variant="default" />
          )}
          {secondaryCta && (
            <CtaButton cta={secondaryCta} variant="ghost" />
          )}
        </div>
      )}
    </div>
  );
}

function CtaButton({
  cta,
  variant,
}: {
  readonly cta: EmptyStateCta;
  readonly variant: 'default' | 'ghost';
}) {
  if (cta.href) {
    return (
      <Button variant={variant} size="sm" asChild>
        <Link to={cta.href}>{cta.label}</Link>
      </Button>
    );
  }
  return (
    <Button variant={variant} size="sm" onClick={cta.onClick}>
      {cta.label}
    </Button>
  );
}
