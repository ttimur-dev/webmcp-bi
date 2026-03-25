import { useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useDatasetStore } from '@/entities/dataset';
import type { ChartBlock } from '@/shared/types';
import { query } from '@/shared/lib/duckdb';
import { buildChartOption } from '../lib/buildChartOption';

export function useChartData(block: ChartBlock) {
  const dataset = useDatasetStore((s) => s.datasets.find((d) => d.id === block.datasetId) ?? null);
  const [option, setOption] = useState<EChartsOption | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataset || !block.dimension || !block.measure) {
      setOption(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const dimCol = dataset.columns.find((c) => c.name === block.dimension);

    query({
      tableName: dataset.tableName,
      dimension: block.dimension,
      dimensionType: dimCol?.type ?? 'string',
      measure: block.measure,
      aggregation: block.aggregation,
    })
      .then((result) => {
        if (cancelled) return;
        setOption(buildChartOption(block, result.labels, result.values));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dataset, block.datasetId, block.chartType, block.dimension, block.measure, block.aggregation]);

  return { option, loading };
}
