import type { EChartsOption } from 'echarts';
import type { Panel } from '@/shared/types';

const fmt = (v: unknown) =>
  v == null ? '' : Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function buildPanelOption(panel: Panel, labels: string[], values: number[]): EChartsOption {
  if (panel.panelType === 'pie') {
    return {
      tooltip: { trigger: 'item', valueFormatter: fmt },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: labels.map((name, i) => ({ name, value: values[i] })),
        },
      ],
    };
  }

  return {
    tooltip: { trigger: 'axis', valueFormatter: fmt },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', axisLabel: { formatter: fmt } },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, height: 20, bottom: 4 },
    ],
    series: [
      {
        name: panel.measure ?? undefined,
        type: panel.panelType,
        data: values,
      },
    ],
  };
}
