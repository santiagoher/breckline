import type { ReactNode, SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number | string;
  title?: string;
};

type IconFrameProps = IconProps & {
  children: ReactNode;
};

function IconFrame({
  children,
  title,
  size = 24,
  width = size,
  height = size,
  viewBox = "0 0 24 24",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-hidden": ariaHidden,
  ...props
}: IconFrameProps) {
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);
  const isDecorative =
    ariaHidden === undefined
      ? !hasAccessibleName
      : ariaHidden === true || ariaHidden === "true";

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={isDecorative}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      role={isDecorative ? undefined : "img"}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconFrame>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </IconFrame>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconFrame>
  );
}

export function WebIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18M8 21h8M12 18v3" />
    </IconFrame>
  );
}

export function LandingPageIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 7h16M8 11h8M8 15h5" />
    </IconFrame>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
      <path d="M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2M9 20v-5h6v5" />
    </IconFrame>
  );
}

export function CorporateIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M5 21V5l7-3 7 3v16M3 21h18" />
      <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </IconFrame>
  );
}

export function PlatformIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 9v11M12 13h5M12 16h3" />
    </IconFrame>
  );
}

export function PwaIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M10 5h4M12 18v-6M9.5 14.5 12 12l2.5 2.5" />
    </IconFrame>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconFrame>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m9 7 8 5-8 5Z" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </IconFrame>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.6Z" />
      <path d="M8.2 7.9c.2-.5.5-.5.8-.5h.4c.1 0 .3 0 .4.4l.7 1.7c.1.3.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5 1 1.3 1.8 2.3 2.3.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.4 0 .2-.1 1.2-.6 1.7-.5.6-1.3.9-2.1.8-1.1-.1-2.7-.6-4.5-2.2-1.4-1.3-2.4-2.9-2.7-4-.3-1 .1-1.7.4-2.2Z" />
    </IconFrame>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconFrame>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M7.2 3.5 4.6 4.7c-.8.4-1.2 1.3-1 2.2 1.2 6.6 6.3 11.7 12.9 12.9.9.2 1.8-.2 2.2-1l1.2-2.6-4.1-2-1.2 1.8c-2.8-1.2-5-3.4-6.2-6.2l1.8-1.2-2-4.1Z" />
    </IconFrame>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconFrame>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconFrame>
  );
}

export function BrandingIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z" />
    </IconFrame>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M4 9h5l11-5v16L9 15H4V9ZM9 9v6M5 15l2 6h4l-2-6" />
    </IconFrame>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m12 3 9 5v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v8M7.5 5.5l9 5" />
    </IconFrame>
  );
}

export function BusinessCardIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="10" r="1.5" />
      <path d="M5.5 16v-1a2.5 2.5 0 0 1 5 0v1M14 10h4M14 14h3" />
    </IconFrame>
  );
}

export const iconComponents = {
  arrow: ArrowIcon,
  branding: BrandingIcon,
  businessCard: BusinessCardIcon,
  check: CheckIcon,
  chevron: ChevronIcon,
  close: CloseIcon,
  corporate: CorporateIcon,
  instagram: InstagramIcon,
  landingPage: LandingPageIcon,
  location: LocationIcon,
  mail: MailIcon,
  megaphone: MegaphoneIcon,
  menu: MenuIcon,
  package: PackageIcon,
  phone: PhoneIcon,
  platform: PlatformIcon,
  play: PlayIcon,
  pwa: PwaIcon,
  store: StoreIcon,
  web: WebIcon,
  whatsapp: WhatsAppIcon,
} as const;

export type IconName = keyof typeof iconComponents;
