import type { Breakpoint } from '@/shared/types';

export const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } as const satisfies Record<
  Breakpoint,
  number
>;
export const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 } as const satisfies Record<Breakpoint, number>;
export const BREAKPOINT_ORDER: Breakpoint[] = ['lg', 'md', 'sm', 'xs', 'xxs'];
