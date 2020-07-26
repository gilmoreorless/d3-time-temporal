import intervalFactory from "./intervalFactory.js";

var hour = intervalFactory('hour', function(dateTime) {
  return dateTime.with({ minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});

export default hour;
export var hours = hour.range;
