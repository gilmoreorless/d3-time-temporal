import interval from "./interval.js";
import diff from "./diff.js";

var daysInWeek = 7; // NOTE: This assumes Gregorian calendar

function weekday(i) {
  return interval(function(dateTime) {
    var dayAdjust = (dateTime.dayOfWeek + daysInWeek - i) % daysInWeek;
    var dt = dayAdjust ? dateTime.minus({ days: dayAdjust }) : dateTime;
    return dt.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
  }, function(dateTime, step) {
    if (step < 0) return dateTime.minus({ days: -step * daysInWeek });
    return dateTime.plus({ days: step * daysInWeek });
  }, function(start, end) {
    return diff(start, end, 'days') / daysInWeek;
  });
}

export var sunday = weekday(0);
export var monday = weekday(1);
export var tuesday = weekday(2);
export var wednesday = weekday(3);
export var thursday = weekday(4);
export var friday = weekday(5);
export var saturday = weekday(6);

export var sundays = sunday.range;
export var mondays = monday.range;
export var tuesdays = tuesday.range;
export var wednesdays = wednesday.range;
export var thursdays = thursday.range;
export var fridays = friday.range;
export var saturdays = saturday.range;
