import React, { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default function StackedBarChart({ data, height = 400 }) {
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
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    const chartData =
      data && data.length > 0
        ? data
        : [
            { category: 'Week 1', completed: 45, inProgress: 30, notStarted: 25 },
            { category: 'Week 2', completed: 52, inProgress: 28, notStarted: 20 },
            { category: 'Week 3', completed: 61, inProgress: 25, notStarted: 14 },
            { category: 'Week 4', completed: 68, inProgress: 22, notStarted: 10 },
          ];

    // Create X axis
    const xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.labels.template.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 12,
    });
    xRenderer.grid.template.setAll({
      stroke: am5.color('#3f3f46'),
      strokeOpacity: 0.3,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: xRenderer,
      })
    );

    xAxis.data.setAll(chartData);

    // Create Y axis
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 12,
    });
    yRenderer.grid.template.setAll({
      stroke: am5.color('#3f3f46'),
      strokeOpacity: 0.3,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer,
      })
    );

    // Create series
    function makeSeries(name, fieldName, color) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: 'category',
        })
      );

      series.columns.template.setAll({
        tooltipText: '{name}: {valueY}',
        width: am5.percent(70),
        tooltipY: am5.percent(10),
        strokeOpacity: 0,
        cornerRadiusTL: 2,
        cornerRadiusTR: 2,
        fill: am5.color(color),
      });

      series.data.setAll(chartData);
      series.appear();

      return series;
    }

    makeSeries('Completed', 'completed', '#10b981');
    makeSeries('In Progress', 'inProgress', '#3b82f6');
    makeSeries('Not Started', 'notStarted', '#ef4444');

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
      })
    );

    legend.labels.template.setAll({
      fill: am5.color('#e5e7eb'),
      fontSize: 13,
    });

    legend.data.setAll(chart.series.values);

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
        background: '#27272a',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div ref={chartDivRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
