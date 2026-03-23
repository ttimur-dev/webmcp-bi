import * as echarts from 'echarts';

export const PAPER_STUDIO_THEME_NAME = 'paper-studio';

export function registerPaperStudioTheme() {
  echarts.registerTheme(PAPER_STUDIO_THEME_NAME, {
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
}
