import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default function LineChart({ data, height = 400 }) {
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

    if (root._logo) {
      try {
        root._logo.dispose();
      } catch (e) {}
    }

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    );

    const chartData =
      data && data.length > 0
        ? data
        : [
            { date: new Date(2024, 0, 1).getTime(), value: 120 },
            { date: new Date(2024, 1, 1).getTime(), value: 145 },
            { date: new Date(2024, 2, 1).getTime(), value: 178 },
            { date: new Date(2024, 3, 1).getTime(), value: 165 },
            { date: new Date(2024, 4, 1).getTime(), value: 198 },
            { date: new Date(2024, 5, 1).getTime(), value: 223 },
          ];

    // Create X axis (date)
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: { timeUnit: 'month', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
      })
    );

    xAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 12,
    });

    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color('#3f3f46'),
      strokeOpacity: 0.3,
    });

    // Create Y axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 12,
    });

    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color('#3f3f46'),
      strokeOpacity: 0.3,
    });

    // Create series
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Progress',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        stroke: am5.color('#3b82f6'),
        fill: am5.color('#3b82f6'),
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 3,
    });

    series.fills.template.setAll({
      fillOpacity: 0.1,
      visible: true,
    });

    // Add bullets
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color('#3b82f6'),
          stroke: am5.color('#18181b'),
          strokeWidth: 2,
        }),
      });
    });

    // Add tooltip
    series.set(
      'tooltip',
      am5.Tooltip.new(root, {
        labelText: '{valueY}',
        getFillFromSprite: false,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color('#27272a'),
          strokeWidth: 1,
          stroke: am5.color('#52525b'),
        }),
      })
    );

    series.get('tooltip').label.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 13,
    });

    // Add cursor
    chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
      })
    );

    series.data.setAll(chartData);
    series.appear(1000);
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
        background: '#18181b',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div ref={chartDivRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
