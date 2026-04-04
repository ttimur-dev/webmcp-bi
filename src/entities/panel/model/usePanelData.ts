import { useEffect, useState } from 'react';
import { useDatasetStore } from '@/entities/dataset';
import { query } from '@/shared/lib/duckdb';
import { buildPanelOption } from '../lib/buildPanelOption';
import type { EChartsOption } from 'echarts';
import type { Panel } from '@/shared/types';

export function usePanelData(panel: Panel) {
  const dataset = useDatasetStore((s) => s.datasets.find((d) => d.id === panel.datasetId) ?? null);
  const [option, setOption] = useState<EChartsOption | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataset || !panel.dimension || !panel.measure) {
      setOption(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const dimCol = dataset.columns.find((c) => c.name === panel.dimension);

    query({
      tableName: dataset.tableName,
      dimension: panel.dimension,
      dimensionType: dimCol?.type ?? 'string',
      measure: panel.measure,
      aggregation: panel.aggregation,
    })
      .then((result) => {
        if (cancelled) return;
        setOption(buildPanelOption(panel, result.labels, result.values));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dataset, panel.datasetId, panel.panelType, panel.dimension, panel.measure, panel.aggregation]);

  return { option, loading };
}
