import intervalFactory from "./intervalFactory.js";

var month = intervalFactory('month', function(dateTime) {
  return dateTime.with({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});

export default month;
export var months = month.range;
