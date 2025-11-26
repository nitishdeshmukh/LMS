import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/**
 * Usage:
 * <ColumnChart
 * data={[
 * { category: 'Jan', value: 50 },
 * { category: 'Feb', value: 78 }
 * ]}
 * height={400}
 * onDateChange={(start, end) => console.log("Filter:", start, end)}
 * />
 */

export default function ColumnChart({ data, height = 400, onDateChange }) {
  const chartDivRef = useRef(null);
  const rootRef = useRef(null);

  // Default to start of current year and today
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    else setEndDate(value);

    // Trigger parent callback to reload/filter data based on new range
    if (onDateChange) {
      onDateChange(
        type === 'start' ? value : startDate,
        type === 'end' ? value : endDate
      );
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

    // Set interface colors for dark theme
    root.interfaceColors.set('grid', am5.color(0x3f3f46)); // zinc-700
    root.interfaceColors.set('text', am5.color(0xe5e7eb)); // zinc-200

    if (root._logo) {
      try {
        root._logo.dispose();
      } catch (e) {}
    }

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      })
    );

    const chartData =
      data && data.length > 0
        ? data
        : [
            { category: 'Jan', value: 50 },
            { category: 'Feb', value: 78 },
            { category: 'Mar', value: 63 },
            { category: 'Apr', value: 90 },
            { category: 'May', value: 120 },
          ];

    // Create X axis renderer
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
    });

    xRenderer.labels.template.setAll({
      rotation: 0,
      centerY: am5.p50,
      centerX: am5.p50,
      oversizedBehavior: 'wrap',
      maxWidth: 100,
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 12,
    });

    // Hide grid lines
    xRenderer.grid.template.setAll({
      visible: false,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: 'category',
        renderer: xRenderer,
      })
    );

    xAxis.data.setAll(chartData);

    // Create Y axis renderer
    const yRenderer = am5xy.AxisRendererY.new(root, {});

    yRenderer.labels.template.setAll({
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 12,
    });

    // Hide grid lines
    yRenderer.grid.template.setAll({
      visible: false,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
      })
    );

    // Create column series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'category',
        sequencedInterpolation: true,
      })
    );

    // Column styling
    series.columns.template.setAll({
      tooltipText: '{categoryX}: {valueY}',
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      strokeOpacity: 0,
      fill: am5.color(0x3b82f6), // blue-500
      width: am5.percent(60),
    });

    // Tooltip styling
    series.set(
      'tooltip',
      am5.Tooltip.new(root, {
        getFillFromSprite: false,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0x27272a), // zinc-800
          strokeWidth: 1,
          stroke: am5.color(0x52525b), // zinc-600
        }),
      })
    );

    series.get('tooltip').label.setAll({
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 13,
    });

    // Add labels above each column
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: '{valueY}',
          centerX: am5.p50,
          centerY: am5.p100,
          populateText: true,
          dy: -10,
          fontSize: 12,
          fill: am5.color(0xe5e7eb), // zinc-200
          fontWeight: '500',
        }),
      });
    });

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
        background: '#18181b', // bg-zinc-900 (Container background)
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
          Performance Overview
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
              onChange={(e) => handleDateChange('start', e.target.value)}
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
              onChange={(e) => handleDateChange('end', e.target.value)}
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