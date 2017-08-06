import { D3_TIME_FORMAT_OPTIONS } from './controls';
import * as v from '../validators';

export const sections = {
  druidTimeSeries: {
    label: 'Time',
    description: 'Time related form attributes',
    controlSetRows: [
      ['granularity', 'druid_time_origin'],
      ['since', 'until'],
    ],
  },
  datasourceAndVizType: {
    label: 'Datasource & Chart Type',
    controlSetRows: [
      ['datasource'],
      ['viz_type'],
      ['slice_id', 'cache_timeout'],
    ],
  },
  sqlaTimeSeries: {
    label: 'Time',
    description: 'Time related form attributes',
    controlSetRows: [
      ['granularity_sqla', 'time_grain_sqla'],
      ['since', 'until'],
    ],
  },
  sqlClause: {
    label: 'SQL',
    controlSetRows: [
      ['where'],
      ['having'],
    ],
    description: 'This section exposes ways to include snippets of SQL in your query',
  },
  NVD3TimeSeries: [
    {
      label: null,
      controlSetRows: [
        ['metrics'],
        ['groupby'],
        ['limit', 'timeseries_limit_metric'],
      ],
    },
    {
      label: 'Advanced Analytics',
      description: 'This section contains options ' +
      'that allow for advanced analytical post processing ' +
      'of query results',
      controlSetRows: [
        ['rolling_type', 'rolling_periods'],
        ['time_compare'],
        ['num_period_compare', 'period_ratio_type'],
        ['resample_how', 'resample_rule'],
        ['resample_fillmethod'],
      ],
    },
  ],
  filters: [
    {
      label: 'Filters',
      description: 'Filters are defined using comma delimited strings as in <US,FR,Other>' +
      'Leave the value control empty to filter empty strings or nulls' +
      'For filters with comma in values, wrap them in single quotes' +
      "as in <NY, 'Tahoe, CA', DC>",
      controlSetRows: [['filters']],
    },
    {
      label: 'Result Filters',
      description: 'The filters to apply after post-aggregation.' +
      'Leave the value control empty to filter empty strings or nulls',
      controlSetRows: [['having_filters']],
    },
  ],
};

export const visTypes = {
  dist_bar: {
    label: 'Distribution - Bar Chart',
    controlPanelSections: [
      {
        label: 'Chart Options',
        controlSetRows: [
          ['metrics'],
          ['groupby'],
          ['columns'],
          ['row_limit'],
          ['show_legend', 'show_bar_value'],
          ['bar_stacked', 'order_bars'],
          ['y_axis_format', 'bottom_margin'],
          ['x_axis_label', 'y_axis_label'],
          ['reduce_x_ticks', 'contribution'],
          ['show_controls'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: 'Series',
      },
      columns: {
        label: 'Breakdowns',
        description: 'Defines how each series is broken down',
      },
    },
  },

  pie: {
    label: 'Pie Chart',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics', 'groupby'],
          ['limit'],
          ['pie_label_type'],
          ['donut', 'show_legend'],
          ['labels_outside'],
        ],
      },
    ],
  },

  line: {
    label: 'Time Series - Line Chart',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['rich_tooltip', null],
          ['show_markers', 'x_axis_showminmax'],
          ['line_interpolation', 'contribution'],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_label', 'x_axis_format'],
          ['y_axis_label', 'y_axis_bounds'],
          ['y_axis_format', 'y_log_scale'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  dual_line: {
    label: 'Dual Axis Line Chart',
    requiresTime: true,
    controlPanelSections: [
      {
        label: 'Chart Options',
        controlSetRows: [
          ['x_axis_format'],
        ],
      },
      {
        label: 'Y Axis 1',
        controlSetRows: [
          ['metric', 'y_axis_format'],
        ],
      },
      {
        label: 'Y Axis 2',
        controlSetRows: [
          ['metric_2', 'y_axis_2_format'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: 'Left Axis Metric',
        description: 'Choose a metric for left axis',
      },
      y_axis_format: {
        label: 'Left Axis Format',
      },
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  bar: {
    label: 'Time Series - Bar Chart',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['show_brush', 'show_legend', 'show_bar_value'],
          ['rich_tooltip', 'contribution'],
          ['line_interpolation', 'bar_stacked'],
          ['bottom_margin', 'show_controls'],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_showminmax', 'reduce_x_ticks'],
          ['x_axis_label', 'y_axis_label'],
          ['y_axis_bounds', 'y_log_scale'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  compare: {
    label: 'Time Series - Percent Change',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['x_axis_format', 'y_axis_format'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        choices: D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
      },
    },
  },

  area: {
    label: 'Time Series - Stacked',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['line_interpolation', 'stacked_style'],
          ['rich_tooltip', 'contribution'],
          ['show_controls', null],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_format', 'x_axis_showminmax'],
          ['y_axis_format', 'y_axis_bounds'],
          ['y_log_scale', null],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
    controlOverrides: {
      x_axis_format: {
        default: 'smart_date',
        choices: D3_TIME_FORMAT_OPTIONS,
      },
    },
  },

  table: {
    label: 'Table View',
    controlPanelSections: [
      {
        label: 'GROUP BY',
        description: 'Use this section if you want a query that aggregates',
        controlSetRows: [
          ['groupby', 'metrics'],
          ['include_time'],
        ],
      },
      {
        label: 'NOT GROUPED BY',
        description: 'Use this section if you want to query atomic rows',
        controlSetRows: [
          ['all_columns'],
          ['order_by_cols'],
        ],
      },
      {
        label: 'Options',
        controlSetRows: [
          ['table_timestamp_format'],
          ['row_limit', 'page_length'],
          ['include_search', 'table_filter'],
        ],
      },
    ],
    controlOverrides: {
      metrics: {
        validators: [],
      },
      time_grain_sqla: {
        default: null,
      },
    },
  },

  markup: {
    label: 'Markup',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['markup_type'],
          ['code'],
        ],
      },
    ],
  },

  pivot_table: {
    label: 'Pivot Table',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metrics', 'pandas_aggfunc'],
          ['number_format', 'combine_metric'],
          ['pivot_margins'],
        ],
      },
    ],
    controlOverrides: {
      groupby: { includeTime: true },
      columns: { includeTime: true },
    },
  },

  separator: {
    label: 'Separator',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['code'],
        ],
      },
    ],
    controlOverrides: {
      code: {
        default: '####Section Title\n' +
        'A paragraph describing the section' +
        'of the dashboard, right before the separator line ' +
        '\n\n' +
        '---------------',
      },
    },
  },

  word_cloud: {
    label: 'Word Cloud',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'metric', 'limit'],
          ['size_from', 'size_to'],
          ['rotation'],
        ],
      },
    ],
  },

  treemap: {
    label: 'Treemap',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby'],
        ],
      },
      {
        label: 'Chart Options',
        controlSetRows: [
          ['treemap_ratio'],
          ['number_format'],
        ],
      },
    ],
  },

  cal_heatmap: {
    label: 'Calendar Heatmap',
    requiresTime: true,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['domain_granularity'],
          ['subdomain_granularity'],
        ],
      },
    ],
  },

  box_plot: {
    label: 'Box Plot',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby', 'limit'],
        ],
      },
      {
        label: 'Chart Options',
        controlSetRows: [
          ['whisker_options'],
        ],
      },
    ],
  },

  bubble: {
    label: 'Bubble Chart',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'entity'],
          ['size', 'limit'],
        ],
      },
      {
        label: 'Chart Options',
        controlSetRows: [
          ['show_legend', null],
        ],
      },
      {
        label: 'Bubbles',
        controlSetRows: [
          ['size', 'max_bubble_size'],
        ],
      },
      {
        label: 'X Axis',
        controlSetRows: [
          ['x', 'x_axis_format'],
          ['x_axis_label', 'x_log_scale'],
        ],
      },
      {
        label: 'Y Axis',
        controlSetRows: [
          ['y', 'y_axis_format'],
          ['y_axis_label', 'y_log_scale'],
        ],
      },
    ],
    controlOverrides: {
      x_axis_format: {
        default: '.3s',
      },
    },
  },

  bullet: {
    label: 'Bullet Chart',
    requiresTime: false,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['ranges', 'range_labels'],
          ['markers', 'marker_labels'],
          ['marker_lines', 'marker_line_labels'],
        ],
      },
    ],
  },

  big_number: {
    label: 'Big Number with Trendline',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['compare_lag', 'compare_suffix'],
          ['y_axis_format', null],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: 'Number format',
      },
    },
  },

  big_number_total: {
    label: 'Big Number',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['subheader'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: 'Number format',
      },
    },
  },

  histogram: {
    label: 'Histogram',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x'],
          ['row_limit'],
        ],
      },
      {
        label: 'Histogram Options',
        controlSetRows: [
          ['link_length'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: 'Numeric Column',
        description: 'Select the numeric column to draw the histogram',
      },
      link_length: {
        label: 'No of Bins',
        description: 'Select number of bins for the histogram',
        default: 5,
      },
    },
  },

  sunburst: {
    label: 'Sunburst',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric', 'secondary_metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: 'Primary Metric',
        description: 'The primary metric is used to define the arc segment sizes',
      },
      secondary_metric: {
        label: 'Secondary Metric',
        description: 'This secondary metric is used to ' +
        'define the color as a ratio against the primary metric. ' +
        'If the two metrics match, color is mapped level groups',
      },
      groupby: {
        label: 'Hierarchy',
        description: 'This defines the level of the hierarchy',
      },
    },
  },

  sankey: {
    label: 'Sankey',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: 'Source / Target',
        description: 'Choose a source and a target',
      },
    },
  },

  directed_force: {
    label: 'Directed Force Layout',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
      {
        label: 'Force Layout',
        controlSetRows: [
          ['link_length'],
          ['charge'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: 'Source / Target',
        description: 'Choose a source and a target',
      },
    },
  },
  chord: {
    label: 'Chord Diagram',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metric'],
          ['row_limit', 'y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: 'Number format',
        description: 'Choose a number format',
      },
      groupby: {
        label: 'Source',
        multi: false,
        validators: [v.nonEmpty],
        description: 'Choose a source',
      },
      columns: {
        label: 'Target',
        multi: false,
        validators: [v.nonEmpty],
        description: 'Choose a target',
      },
    },
  },
  country_map: {
    label: 'Country Map',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['select_country'],
          ['entity'],
          ['metric'],
          ['linear_color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: 'ISO 3166-1 codes of region/province/department',
        description: "It's ISO 3166-1 of your region/province/department in your table. (see documentation for list of ISO 3166-1)",
      },
      metric: {
        label: 'Metric',
        description: 'Metric to display bottom title',
      },
    },
  },
  world_map: {
    label: 'World Map',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['entity'],
          ['country_fieldtype'],
          ['metric'],
        ],
      },
      {
        label: 'Bubbles',
        controlSetRows: [
          ['show_bubbles'],
          ['secondary_metric'],
          ['max_bubble_size'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: 'Country Control',
        description: '3 letter code of the country',
      },
      metric: {
        label: 'Metric for color',
        description: 'Metric that defines the color of the country',
      },
      secondary_metric: {
        label: 'Bubble size',
        description: 'Metric that defines the size of the bubble',
      },
    },
  },

  filter_box: {
    label: 'Filter Box',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['date_filter', 'instant_filtering'],
          ['groupby'],
          ['metric'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: 'Filter controls',
        description: (
          'The controls you want to filter on. Note that only columns ' +
          'checked as "filterable" will show up on this list.'
        ),
        mapStateToProps: state => ({
          options: (state.datasource) ? state.datasource.columns.filter(c => c.filterable) : [],
        }),
      },
    },
  },

  iframe: {
    label: 'iFrame',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['url'],
        ],
      },
    ],
  },

  para: {
    label: 'Parallel Coordinates',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series'],
          ['metrics'],
          ['secondary_metric'],
          ['limit'],
          ['show_datatable', 'include_series'],
        ],
      },
    ],
  },

  heatmap: {
    label: 'Heatmap',
    controlPanelSections: [
      {
        label: 'Axis & Metrics',
        controlSetRows: [
          ['all_columns_x'],
          ['all_columns_y'],
          ['metric'],
        ],
      },
      {
        label: 'Heatmap Options',
        controlSetRows: [
          ['linear_color_scheme'],
          ['xscale_interval', 'yscale_interval'],
          ['canvas_image_rendering'],
          ['normalize_across'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        validators: [v.nonEmpty],
      },
      all_columns_y: {
        validators: [v.nonEmpty],
      },
    },
  },

  horizon: {
    label: 'Horizon',
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['series_height', 'horizon_color_scale'],
        ],
      },
    ],
  },

  mapbox: {
    label: 'Mapbox',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x', 'all_columns_y'],
          ['clustering_radius'],
          ['row_limit'],
          ['groupby'],
          ['render_while_dragging'],
        ],
      },
      {
        label: 'Points',
        controlSetRows: [
          ['point_radius'],
          ['point_radius_unit'],
        ],
      },
      {
        label: 'Labelling',
        controlSetRows: [
          ['mapbox_label'],
          ['pandas_aggfunc'],
        ],
      },
      {
        label: 'Visual Tweaks',
        controlSetRows: [
          ['mapbox_style'],
          ['global_opacity'],
          ['mapbox_color'],
        ],
      },
      {
        label: 'Viewport',
        controlSetRows: [
          ['viewport_longitude'],
          ['viewport_latitude'],
          ['viewport_zoom'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: 'Longitude',
        description: 'Column containing longitude data',
      },
      all_columns_y: {
        label: 'Latitude',
        description: 'Column containing latitude data',
      },
      pandas_aggfunc: {
        label: 'Cluster label aggregator',
        description: 'Aggregate function applied to the list of points ' +
        'in each cluster to produce the cluster label.',
      },
      rich_tooltip: {
        label: 'Tooltip',
        description: 'Show a tooltip when hovering over points and clusters ' +
        'describing the label',
      },
      groupby: {
        description: 'One or many controls to group by. If grouping, latitude ' +
        'and longitude columns must be present.',
      },
    },
  },

  event_flow: {
    label: 'Event flow',
    requiresTime: true,
    controlPanelSections: [
      {
        label: 'Event definition',
        controlSetRows: [
          ['entity'],
          ['all_columns_x'],
          ['row_limit'],
          ['order_by_entity'],
          ['min_leaf_node_event_count'],
        ],
      },
      {
        label: 'Additional meta data',
        controlSetRows: [
          ['all_columns'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: 'Column containing entity ids',
        description: 'e.g., a "user id" column',
      },
      all_columns_x: {
        label: 'Column containing event names',
        validators: [v.nonEmpty],
        default: control => (
          control.choices && control.choices.length > 0 ?
            control.choices[0][0] : null
        ),
      },
      row_limit: {
        label: 'Event count limit',
        description: 'The maximum number of events to return, equivalent to number of rows',
      },
      all_columns: {
        label: 'Meta data',
        description: 'Select any columns for meta data inspection',
      },
    },
  },
};

export default visTypes;

export function sectionsToRender(vizType, datasourceType) {
  const viz = visTypes[vizType];
  return [].concat(
    sections.datasourceAndVizType,
    datasourceType === 'table' ? sections.sqlaTimeSeries : sections.druidTimeSeries,
    viz.controlPanelSections,
    datasourceType === 'table' ? sections.sqlClause : [],
    datasourceType === 'table' ? sections.filters[0] : sections.filters,
  );
}
