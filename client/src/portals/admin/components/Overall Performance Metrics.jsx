import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/**
 * Usage:
 * <RadarChart
 *   data={[
 *     { category: "Research", value: 80, full: 100 },
 *     { category: "Marketing", value: 35, full: 100 }
 *   ]}
 *   height={500}
 * />
 */

export default function RadarChart({ data, height = 500 }) {
  const chartDivRef = useRef(null);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    if (!chartDivRef.current) return;

    const root = am5.Root.new(chartDivRef.current);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Set dark theme colors
    root.interfaceColors.set('grid', am5.color(0x3f3f46)); // zinc-700
    root.interfaceColors.set('text', am5.color(0xe5e7eb)); // zinc-200

    if (root._logo) {
      try {
        root._logo.dispose();
      } catch (e) {}
    }

    // Create chart
    const chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        innerRadius: am5.percent(20),
        startAngle: -90,
        endAngle: 180,
      }),
    );

    // Sample data
    const chartData =
      data && data.length > 0
        ? data
        : [
            { category: 'Course Completion', value: 85, full: 100 },
            { category: 'Student Engagement', value: 72, full: 100 },
            { category: 'Assessment Scores', value: 91, full: 100 },
            { category: 'Attendance Rate', value: 78, full: 100 },
            { category: 'Assignment Submission', value: 88, full: 100 },
          ];

    // Color palette for dark theme
    const colorPalette = [
      am5.color('#3b82f6'), // blue-500
      am5.color('#10b981'), // emerald-500
      am5.color('#f59e0b'), // amber-500
      am5.color('#8b5cf6'), // violet-500
      am5.color('#ec4899'), // pink-500
    ];

    // Add data with colors
    const dataWithColors = chartData.map((item, index) => ({
      ...item,
      columnSettings: {
        fill: colorPalette[index % colorPalette.length],
      },
    }));

    // Add cursor
    const cursor = chart.set(
      'cursor',
      am5radar.RadarCursor.new(root, {
        behavior: 'zoomX',
      }),
    );
    cursor.lineY.set('visible', false);

    // Create X axis (circular)
    const xRenderer = am5radar.AxisRendererCircular.new(root, {});
    xRenderer.labels.template.setAll({
      radius: 10,
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 12,
    });
    xRenderer.grid.template.setAll({
      stroke: am5.color(0x3f3f46), // zinc-700
      strokeOpacity: 0.3,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: xRenderer,
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: "#'%'",
        tooltip: am5.Tooltip.new(root, {
          getFillFromSprite: false,
          background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0x27272a), // zinc-800
            strokeWidth: 1,
            stroke: am5.color(0x52525b), // zinc-600
          }),
        }),
      }),
    );

    // Tooltip label styling
    xAxis.get('tooltip').label.setAll({
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 13,
    });

    // Create Y axis (radial)
    const yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20,
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: '500',
      fontSize: 14,
      fill: am5.color(0xe5e7eb), // zinc-200
      templateField: 'columnSettings',
    });

    yRenderer.grid.template.setAll({
      stroke: am5.color(0x3f3f46), // zinc-700
      strokeOpacity: 0.2,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: yRenderer,
      }),
    );

    yAxis.data.setAll(dataWithColors);

    // Background series (full circle)
    const series1 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: 'full',
        categoryYField: 'category',
        fill: am5.color(0x3f3f46), // zinc-700
      }),
    );

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.15,
      strokeOpacity: 0,
      cornerRadius: 20,
    });

    series1.data.setAll(dataWithColors);

    // Value series (actual data)
    const series2 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: 'value',
        categoryYField: 'category',
      }),
    );

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: '{category}: {valueX}%',
      cornerRadius: 20,
      templateField: 'columnSettings',
    });

    // Tooltip with dark theme
    series2.columns.template.set(
      'tooltip',
      am5.Tooltip.new(root, {
        getFillFromSprite: false,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0x27272a), // zinc-800
          strokeWidth: 1,
          stroke: am5.color(0x52525b), // zinc-600
        }),
      }),
    );

    series2.columns.template.get('tooltip').label.setAll({
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 13,
    });

    series2.data.setAll(dataWithColors);

    // Animate
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
    };
  }, [data, height]);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        background: '#18181b', // bg-zinc-900
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div ref={chartDivRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
