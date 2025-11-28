import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/**
 * Usage:
 * <SmoothLineChart
 * data={[
 * { date: new Date(2024, 0, 1).getTime(), value: 120, value2: 95 },
 * { date: new Date(2024, 1, 1).getTime(), value: 145, value2: 110 }
 * ]}
 * height={400}
 * series={[
 * { name: "Enrollments", valueField: "value", color: "#3b82f6" },
 * { name: "Completions", valueField: "value2", color: "#10b981" }
 * ]}
 * onDateChange={(start, end) => console.log("Filter range:", start, end)}
 * />
 */

export default function SmoothLineChart({ data, height = 400, series = [], onDateChange }) {
  const chartDivRef = useRef(null);
  const rootRef = useRef(null);

  // Default to start of current year and today
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    else setEndDate(value);

    // Trigger parent callback to reload/filter data based on new range
    if (onDateChange) {
      onDateChange(type === 'start' ? value : startDate, type === 'end' ? value : endDate);
    }
  };

  useLayoutEffect(() => {
    if (rootRef.current) {
      rootRef.current.dispose();
      rootRef.current = null;
    }

    if (!chartDivRef.current) return;

    const root = am5.Root.new(chartDivRef.current);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    // Dark theme colors
    root.interfaceColors.set('grid', am5.color(0x3f3f46));
    root.interfaceColors.set('text', am5.color(0xe5e7eb));

    if (root._logo) {
      try {
        root._logo.dispose();
      } catch (e) {}
    }

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      }),
    );

    // Sample data fallback
    const chartData =
      data && data.length > 0
        ? data
        : [
            { date: new Date(2024, 0, 1).getTime(), value: 120, value2: 95 },
            { date: new Date(2024, 1, 1).getTime(), value: 145, value2: 110 },
            { date: new Date(2024, 2, 1).getTime(), value: 178, value2: 125 },
            { date: new Date(2024, 3, 1).getTime(), value: 165, value2: 140 },
            { date: new Date(2024, 4, 1).getTime(), value: 198, value2: 155 },
            { date: new Date(2024, 5, 1).getTime(), value: 223, value2: 180 },
            { date: new Date(2024, 6, 1).getTime(), value: 245, value2: 200 },
          ];

    // Default series config
    const defaultSeries = [
      { name: 'Enrollments', valueField: 'value', color: '#3b82f6' },
      { name: 'Completions', valueField: 'value2', color: '#10b981' },
    ];

    const seriesConfig = series.length > 0 ? series : defaultSeries;

    // Create X axis (date)
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.3,
        baseInterval: { timeUnit: 'month', count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
      }),
    );

    xAxis.get('renderer').labels.template.setAll({
      fill: am5.color(0xe5e7eb),
      fontSize: 12,
    });

    xAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(0x3f3f46),
      strokeOpacity: 0.3,
    });

    // Create Y axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      }),
    );

    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color(0xe5e7eb),
      fontSize: 12,
    });

    yAxis.get('renderer').grid.template.setAll({
      stroke: am5.color(0x3f3f46),
      strokeOpacity: 0.3,
    });

    // Create series
    seriesConfig.forEach(seriesItem => {
      const lineSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: seriesItem.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesItem.valueField,
          valueXField: 'date',
          stroke: am5.color(seriesItem.color),
          fill: am5.color(seriesItem.color),
        }),
      );

      // Smooth curve
      lineSeries.strokes.template.setAll({
        strokeWidth: 3,
      });

      // Gradient fill
      lineSeries.fills.template.setAll({
        fillOpacity: 0.1,
        visible: true,
      });

      // Add bullets (circles on data points)
      lineSeries.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(seriesItem.color),
            stroke: am5.color(0x18181b), // zinc-900
            strokeWidth: 2,
          }),
        });
      });

      // Tooltip
      lineSeries.set(
        'tooltip',
        am5.Tooltip.new(root, {
          labelText: '{name}: {valueY}',
          getFillFromSprite: false,
          background: am5.RoundedRectangle.new(root, {
            fill: am5.color(0x27272a),
            strokeWidth: 1,
            stroke: am5.color(0x52525b),
          }),
        }),
      );

      lineSeries.get('tooltip').label.setAll({
        fill: am5.color(0xe5e7eb),
        fontSize: 13,
      });

      lineSeries.data.setAll(chartData);
      lineSeries.appear(1000);
    });

    // Add cursor
    const cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
        xAxis: xAxis,
      }),
    );

    cursor.lineY.setAll({
      stroke: am5.color(0x52525b),
      strokeWidth: 1,
      strokeDasharray: [4, 4],
    });

    cursor.lineX.setAll({
      stroke: am5.color(0x52525b),
      strokeWidth: 1,
      strokeDasharray: [4, 4],
    });

    // Add legend with dark theme
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      }),
    );

    legend.labels.template.setAll({
      fill: am5.color(0xe5e7eb),
      fontSize: 13,
      fontWeight: '400',
    });

    legend.valueLabels.template.setAll({
      fill: am5.color(0xe5e7eb),
      fontSize: 13,
      fontWeight: '500',
    });

    legend.markers.template.setAll({
      width: 12,
      height: 12,
    });

    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
    };
  }, [data, height, series]);

  return (
    <div
      style={{
        width: '100%',
        background: '#18181b', // bg-zinc-900
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header and Filter Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <h3
          style={{
            color: '#e5e7eb', // zinc-200
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          Trend Analysis
        </h3>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '0.75rem',
                color: '#a1a1aa', // zinc-400
                marginBottom: 2,
              }}
            >
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => handleDateChange('start', e.target.value)}
              style={{
                background: '#27272a', // zinc-800
                border: '1px solid #3f3f46', // zinc-700
                color: '#e5e7eb', // zinc-200
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              style={{
                fontSize: '0.75rem',
                color: '#a1a1aa', // zinc-400
                marginBottom: 2,
              }}
            >
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => handleDateChange('end', e.target.value)}
              style={{
                background: '#27272a', // zinc-800
                border: '1px solid #3f3f46', // zinc-700
                color: '#e5e7eb', // zinc-200
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div
        style={{
          width: '100%',
          height: height,
        }}
      >
        <div ref={chartDivRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
