import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/**
 * Usage:
 * <DoughnutChart
 *   data={[ { category: "A", value: 40, color: "#FF4D4D" }, { category: "B", value: 60 } ]}
 *   height={320}
 *   innerRadiusPercent={50}
 * />
 *
 * data: array of objects { category: string, value: number, color?: string }
 * innerRadiusPercent: 0-100 (50 gives a classic doughnut)
 */

export default function DoughnutChart({
  data = [],
  height = 360,
  innerRadiusPercent = 50,
  showLegend = true,
}) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    // remove amCharts logo if you don't want to show it
    if (root._logo) {
      try {
        root._logo.dispose();
      } catch (e) {
        // ignore if not present
      }
    }

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );

    // Create series (pie -> doughnut via innerRadius)
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: true,
      }),
    );

    // Make it a donut
    series.set('innerRadius', am5.percent(innerRadiusPercent));

    // Styling slices
    series.slices.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 1,
      strokeOpacity: 0.6,
      cornerRadius: 6,
    });

    // Tooltip shows category, value and percent
    series.slices.template.set(
      'tooltipText',
      "{category}: {value} ({valuePercent.formatNumber('#.0')}%)",
    );

    // If you want labels on slices (inside/outside), configure labels/template:
    series.labels.template.setAll({
      text: '{category}',
      radius: 10, // distance from slice center
      centerX: am5.p50,
      centerY: am5.p50,
      oversizedBehavior: 'truncate',
      maxWidth: 120,
      fontSize: 12,
    });

    // Color palette (fallback)
    const defaultPalette = [
      am5.color('#FF4D4D'),
      am5.color('#145efc'),
      am5.color('#4DFF88'),
      am5.color('#FFC44D'),
      am5.color('#B84DFF'),
      am5.color('#4DFFF7'),
    ];

    // Use colors provided in data (dataContext.color) or fallback to palette
    series.slices.template.adapters.add('fill', (fill, target) => {
      const di = target.dataItem;
      if (di && di.dataContext && di.dataContext.color) {
        return am5.color(di.dataContext.color);
      }
      const idx = di ? di.index : 0;
      return defaultPalette[idx % defaultPalette.length];
    });

    series.slices.template.adapters.add('stroke', (stroke, target) => {
      const di = target.dataItem;
      if (di && di.dataContext && di.dataContext.color) {
        return am5.color(di.dataContext.color);
      }
      const idx = di ? di.index : 0;
      return defaultPalette[idx % defaultPalette.length];
    });

    // Optional legend
    if (showLegend) {
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout,
          marginTop: 10,
        }),
      );
      legend.data.setAll(series.dataItems);
    }

    // Set data (fallback sample if no data)
    const chartData =
      data && data.length
        ? data
        : [
            { category: 'A', value: 40 },
            { category: 'B', value: 25 },
            { category: 'C', value: 20 },
            { category: 'D', value: 15 },
          ];

    series.data.setAll(chartData);

    // Appear animation
    series.appear(800, 100);

    return () => {
      root.dispose();
    };
  }, [data, innerRadiusPercent, showLegend, height]);

  return (
    <div style={{ width: '100%', height }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
