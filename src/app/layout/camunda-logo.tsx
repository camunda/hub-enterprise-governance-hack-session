import { cn } from '@/shared/ui/lib/utils';

interface CamundaLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function CamundaLogo({ collapsed = false, className }: CamundaLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="6" fill="var(--camunda-orange)" />
        <path
          d="M16 8C11.58 8 8 11.58 8 16s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.4a6.4 6.4 0 110-12.8 6.4 6.4 0 010 12.8z"
          fill="white"
        />
        <circle cx="16" cy="16" r="2.4" fill="white" />
        <path d="M16 13.6V10.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M13.92 17.2l-2.77 1.6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M18.08 17.2l2.77 1.6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {!collapsed && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          Camunda
        </span>
      )}
    </div>
  );
}
