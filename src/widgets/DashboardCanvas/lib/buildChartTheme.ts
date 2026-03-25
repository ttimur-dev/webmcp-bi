function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function buildChartTheme(): object {
  return {
    backgroundColor: 'transparent',
    color: [
      cssVar('--color-chart-1'),
      cssVar('--color-chart-2'),
      cssVar('--color-chart-3'),
      cssVar('--color-chart-4'),
      cssVar('--color-chart-5'),
      cssVar('--color-chart-6'),
    ],
    textStyle: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: cssVar('--color-muted-foreground'),
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: cssVar('--color-border') } },
      axisTick: { lineStyle: { color: cssVar('--color-border') } },
      axisLabel: { color: cssVar('--color-text-subtle'), fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
      splitLine: { lineStyle: { color: cssVar('--color-muted'), type: 'dashed' as const } },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: cssVar('--color-text-subtle'), fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
      splitLine: { lineStyle: { color: cssVar('--color-muted'), type: 'dashed' as const } },
    },
    legend: {
      textStyle: { color: cssVar('--color-muted-foreground'), fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
    },
    tooltip: {
      backgroundColor: cssVar('--color-background'),
      borderColor: cssVar('--color-border'),
      borderWidth: 1,
      textStyle: { color: cssVar('--color-foreground'), fontSize: 11, fontFamily: "'JetBrains Mono', monospace" },
      extraCssText: 'border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.10);',
    },
    dataZoom: [
      {
        backgroundColor: 'transparent',
        fillerColor: cssVar('--color-primary-bg'),
        borderColor: cssVar('--color-border'),
        textStyle: { color: cssVar('--color-text-subtle') },
        handleStyle: { color: cssVar('--color-primary'), borderColor: cssVar('--color-primary') },
        moveHandleStyle: { color: cssVar('--color-primary') },
      },
    ],
  };
}
