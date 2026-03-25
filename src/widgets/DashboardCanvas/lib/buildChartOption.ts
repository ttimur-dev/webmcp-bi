import type { EChartsOption } from 'echarts';
import type { ChartBlock } from '@/shared/types';

const fmt = (v: unknown) =>
  v == null ? '' : Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function buildChartOption(block: ChartBlock, labels: string[], values: number[]): EChartsOption {
  if (block.chartType === 'pie') {
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
        name: block.measure ?? undefined,
        type: block.chartType,
        data: values,
      },
    ],
  };
}
