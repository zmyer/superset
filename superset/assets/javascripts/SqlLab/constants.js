export const STATE_BSSTYLE_MAP = {
  failed: 'danger',
  pending: 'info',
  fetching: 'info',
  running: 'warning',
  stopped: 'danger',
  success: 'success',
};

export const STATUS_OPTIONS = [
  'success',
  'failed',
  'running',
];

export const TIME_OPTIONS = [
  'now',
  '1 hour ago',
  '1 day ago',
  '7 days ago',
  '28 days ago',
  '90 days ago',
  '1 year ago',
];

export const VISUALIZE_VALIDATION_ERRORS = {
  REQUIRE_CHART_TYPE: 'Pick a chart type!',
  REQUIRE_TIME: 'To use this chart type you need at least one column flagged as a date',
  REQUIRE_DIMENSION: 'To use this chart type you need at least one dimension',
  REQUIRE_AGGREGATION_FUNCTION: 'To use this chart type you need at least one aggregation function',
};
