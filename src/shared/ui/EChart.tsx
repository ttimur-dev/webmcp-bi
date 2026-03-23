import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useRef } from 'react';
import { PAPER_STUDIO_THEME_NAME, registerPaperStudioTheme } from '@/shared/lib/echarts/theme';

// Register theme once
registerPaperStudioTheme();

interface Props {
  option: EChartsOption;
  className?: string;
}

export function EChart({ option, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = echarts.init(el, PAPER_STUDIO_THEME_NAME);
    chartRef.current = chart;

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} className={className ?? 'h-full w-full'} />;
}
