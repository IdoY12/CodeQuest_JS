export interface ResponsiveLayout {
  compact: boolean;
  horizontalPadding: number;
  contentMaxWidth: number;
}

export function getResponsiveLayout(width: number): ResponsiveLayout {
  const compact = width < 390;
  return {
    compact,
    horizontalPadding: compact ? 20 : 28,
    contentMaxWidth: width >= 800 ? 520 : 460,
  };
}
