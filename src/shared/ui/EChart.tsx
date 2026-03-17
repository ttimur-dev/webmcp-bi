import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useRef } from 'react';

// Register custom light "paper-studio" theme
echarts.registerTheme('paper-studio', {
  backgroundColor: 'transparent',
  color: [
    '#8B5E3C', // deep sienna-amber (primary)
    '#B04E30', // terracotta
    '#2E7D8A', // deep teal
    '#5C4E8A', // plum
    '#4A7A3A', // forest green
    '#8A6A2E', // golden brown
  ],
  textStyle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#6B5E4E',
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#DDD4C8' } },
    axisTick: { lineStyle: { color: '#DDD4C8' } },
    axisLabel: { color: '#8A7868', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
    splitLine: { lineStyle: { color: '#EDE7DF', type: 'dashed' as const } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8A7868', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
    splitLine: { lineStyle: { color: '#EDE7DF', type: 'dashed' as const } },
  },
  legend: {
    textStyle: { color: '#6B5E4E', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
  },
  tooltip: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DDD4C8',
    borderWidth: 1,
    textStyle: { color: '#2D2520', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
    extraCssText: 'border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.10);',
  },
  dataZoom: [
    {
      backgroundColor: 'transparent',
      fillerColor: 'rgba(139,94,60,0.08)',
      borderColor: '#DDD4C8',
      textStyle: { color: '#8A7868' },
      handleStyle: { color: '#8B5E3C', borderColor: '#8B5E3C' },
      moveHandleStyle: { color: '#8B5E3C' },
    },
  ],
});

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

    const chart = echarts.init(el, 'paper-studio');
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
