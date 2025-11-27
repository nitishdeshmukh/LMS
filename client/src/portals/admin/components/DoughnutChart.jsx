import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

/**
 * Usage:
 * <DoughnutChart
 * data={[ { category: "A", value: 40, color: "#FF4D4D" }, { category: "B", value: 60 } ]}
 * height={360}
 * innerRadiusPercent={50}
 * onDateChange={(start, end) => console.log("Filter:", start, end)}
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
  onDateChange,
}) {
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
    // Dispose previous root if exists
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

    // Create chart with dark background
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        alignLabels: true,
      }),
    );

    series.set('innerRadius', am5.percent(innerRadiusPercent));

    // Styling slices for dark background
    series.slices.template.setAll({
      stroke: am5.color(0x18181b), // bg-zinc-900
      strokeWidth: 2,
      strokeOpacity: 1,
      cornerRadius: 8,
    });

    // Tooltip with dark theme
    series.slices.template.set(
      'tooltip',
      am5.Tooltip.new(root, {
        labelText: "{category}: {value} ({valuePercent.formatNumber('#.0')}%)",
        getFillFromSprite: false,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(0x27272a), // zinc-800
          strokeWidth: 1,
          stroke: am5.color(0x52525b), // zinc-600
        }),
      }),
    );

    // Tooltip label styling
    series.slices.template.get('tooltip').label.setAll({
      fill: am5.color(0xe5e7eb), // zinc-200
      fontSize: 13,
    });

    // Slice labels - light color for dark background
    series.labels.template.setAll({
      text: '{category}',
      radius: 10,
      centerX: am5.p50,
      centerY: am5.p50,
      oversizedBehavior: 'truncate',
      maxWidth: 120,
      fontSize: 13,
      fill: am5.color(0xe5e7eb), // zinc-200
      fontWeight: '500',
    });

    // Tick lines from slices to labels - light color
    series.ticks.template.setAll({
      stroke: am5.color(0xa1a1aa), // zinc-400
      strokeOpacity: 0.5,
    });

    // Color palette
    const defaultPalette = [
      am5.color('#ef4444'), // red-500
      am5.color('#3b82f6'), // blue-500
      am5.color('#10b981'), // emerald-500
      am5.color('#f59e0b'), // amber-500
      am5.color('#8b5cf6'), // violet-500
      am5.color('#06b6d4'), // cyan-500
    ];

    // Apply colors
    series.slices.template.adapters.add('fill', (fill, target) => {
      const di = target.dataItem;
      if (di && di.dataContext && di.dataContext.color) {
        return am5.color(di.dataContext.color);
      }
      const idx = di ? di.index : 0;
      return defaultPalette[idx % defaultPalette.length];
    });

    // Legend with dark theme
    if (showLegend) {
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout,
          marginTop: 15,
        }),
      );

      // Legend labels - light text
      legend.labels.template.setAll({
        fill: am5.color(0xe5e7eb), // zinc-200
        fontSize: 13,
        fontWeight: '400',
      });

      // Legend value labels - light text
      legend.valueLabels.template.setAll({
        fill: am5.color(0xe5e7eb), // zinc-200
        fontSize: 13,
        fontWeight: '500',
      });

      // Legend markers (colored squares)
      legend.markers.template.setAll({
        width: 12,
        height: 12,
      });

      legend.data.setAll(series.dataItems);
    }

    // Set data
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
    series.appear(800, 100);

    return () => {
      root.dispose();
      rootRef.current = null;
    };
  }, [data, innerRadiusPercent, showLegend, height]);

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
          Distribution Overview
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
