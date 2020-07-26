import intervalFactory from "./intervalFactory.js";

var millisecond = intervalFactory('millisecond', function(dateTime) {
  return dateTime.with({ microsecond: 0, nanosecond: 0 });
});

export default millisecond;
export var milliseconds = millisecond.range;
