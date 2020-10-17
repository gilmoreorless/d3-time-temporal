// https://d3js.org/d3-time/ v1.1.0 Copyright 2020 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

const { Temporal } = require("proposal-temporal");

function newInterval(floori, offseti, count, field, roundingUnit) {

  function interval(dateTime) {
    return floori(arguments.length === 0 ? Temporal.now.dateTime() : dateTime);
  }

  interval.floor = function(dateTime) {
    return floori(dateTime);
  };

  interval.ceil = function(dateTime) {
    var dt = dateTime.minus({ nanoseconds: 1 });
    return offseti(floori(dt), 1);
  };

  interval.round = function(dateTime) {
    if (roundingUnit) {
      return dateTime.round({ smallestUnit: roundingUnit });
    }
    var lower = interval(dateTime),
        upper = interval.ceil(dateTime),
        d0 = dateTime.difference(lower),
        d1 = upper.difference(dateTime);
    // NOTE: Why no Duration compare? https://github.com/tc39/proposal-temporal/issues/608
    var comp = Temporal.DateTime.compare(lower.plus(d0), lower.plus(d1));
    return comp < 0 ? lower : upper;
  };

  interval.offset = function(dateTime, step) {
    return offseti(dateTime, step == null ? 1 : Math.floor(step));
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    if (!(start instanceof Temporal.DateTime) || !(stop instanceof Temporal.DateTime)) return range;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (Temporal.DateTime.compare(start, stop) >= 0 || !(step > 0)) return range;
    previous = start;
    do {
      range.push(previous);
      previous = floori(offseti(previous, step));
    } while (Temporal.DateTime.compare(previous, stop) < 0);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(dateTime) {
      var dt = dateTime;
      while (!test(dt = floori(dt))) dt = dt.minus({ nanoseconds: 1 });
      return dt;
    }, function(dateTime, step) {
      var dt = dateTime;
      if (step < 0) while (++step <= 0) {
        while (dt = offseti(dt, -1), !test(dt)) {} // eslint-disable-line no-empty
      } else while (--step >= 0) {
        while (dt = offseti(dt, +1), !test(dt)) {} // eslint-disable-line no-empty
      }
      return dt;
    });
  };

  if (count) {
    interval.count = function(start, end) {
      return Math.floor(count(floori(start), floori(end)));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(new Temporal.DateTime(0, 1, 1), d) % step === 0; });
    };
  }

  return interval;
}

function diff(start, end, field, largestUnit = 'days') {
  var diff = end.difference(start, { largestUnit });
  return diff[field];
}

/**
 * A helper to de-deduplicate the common interval cases when using Temporal.DateTime
 */
function intervalFactory(unit, floori) {
  var unitPlural = `${unit}s`;
  var diffLargestUnit = (unit === 'year' || unit === 'month') ? unitPlural : 'days';
  var fieldOffset = (unit === 'month' || unit === 'day') ? 1 : 0;
  var roundingUnit = (unit === 'year' || unit === 'month') ? undefined : unit;

  return newInterval(floori, function(dateTime, step) {
    if (step < 0) return dateTime.minus({ [unitPlural]: -step });
    return dateTime.plus({ [unitPlural]: step });
  }, function(start, end) {
    return diff(start, end, unitPlural, diffLargestUnit);
  }, function(dateTime) {
    return dateTime[unit] - fieldOffset;
  }, roundingUnit);
}

var millisecond = intervalFactory('millisecond', function(dateTime) {
  return dateTime.with({ microsecond: 0, nanosecond: 0 });
});
var milliseconds = millisecond.range;

var second = intervalFactory('second', function(dateTime) {
  return dateTime.with({ millisecond: 0, microsecond: 0, nanosecond: 0 });
});
var seconds = second.range;

var minute = intervalFactory('minute', function(dateTime) {
  return dateTime.with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});
var minutes = minute.range;

var hour = intervalFactory('hour', function(dateTime) {
  return dateTime.with({ minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});
var hours = hour.range;

var day = intervalFactory('day', function(dateTime) {
  return dateTime.with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});
var days = day.range;

var daysInWeek = 7; // NOTE: This assumes Gregorian calendar

function weekday(i) {
  return newInterval(function(dateTime) {
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

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;

var month = intervalFactory('month', function(dateTime) {
  return dateTime.with({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});
var months = month.range;

var year = intervalFactory('year', function(dateTime) {
  return dateTime.with({ month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(dateTime) {
    return dateTime.with({
      year: Math.floor(dateTime.year / k) * k,
      month: 1, day: 1,
      hour: 0, minute: 0, second: 0,
      millisecond: 0, microsecond: 0, nanosecond: 0,
    });
  }, function(dateTime, step) {
    return dateTime.with({ year: dateTime.year + step * k });
  });
};
var years = year.range;

var utcMinutes = minute.range;

var utcHours = hour.range;

var utcDays = day.range;

var utcSunday = weekday(0);
var utcMonday = weekday(1);
var utcTuesday = weekday(2);
var utcWednesday = weekday(3);
var utcThursday = weekday(4);
var utcFriday = weekday(5);
var utcSaturday = weekday(6);

var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;

var utcMonths = month.range;

var utcYears = year.range;

exports.timeDay = day;
exports.timeDays = days;
exports.timeFriday = friday;
exports.timeFridays = fridays;
exports.timeHour = hour;
exports.timeHours = hours;
exports.timeInterval = newInterval;
exports.timeMillisecond = millisecond;
exports.timeMilliseconds = milliseconds;
exports.timeMinute = minute;
exports.timeMinutes = minutes;
exports.timeMonday = monday;
exports.timeMondays = mondays;
exports.timeMonth = month;
exports.timeMonths = months;
exports.timeSaturday = saturday;
exports.timeSaturdays = saturdays;
exports.timeSecond = second;
exports.timeSeconds = seconds;
exports.timeSunday = sunday;
exports.timeSundays = sundays;
exports.timeThursday = thursday;
exports.timeThursdays = thursdays;
exports.timeTuesday = tuesday;
exports.timeTuesdays = tuesdays;
exports.timeWednesday = wednesday;
exports.timeWednesdays = wednesdays;
exports.timeWeek = sunday;
exports.timeWeeks = sundays;
exports.timeYear = year;
exports.timeYears = years;
exports.utcDay = day;
exports.utcDays = utcDays;
exports.utcFriday = utcFriday;
exports.utcFridays = utcFridays;
exports.utcHour = hour;
exports.utcHours = utcHours;
exports.utcMillisecond = millisecond;
exports.utcMilliseconds = milliseconds;
exports.utcMinute = minute;
exports.utcMinutes = utcMinutes;
exports.utcMonday = utcMonday;
exports.utcMondays = utcMondays;
exports.utcMonth = month;
exports.utcMonths = utcMonths;
exports.utcSaturday = utcSaturday;
exports.utcSaturdays = utcSaturdays;
exports.utcSecond = second;
exports.utcSeconds = seconds;
exports.utcSunday = utcSunday;
exports.utcSundays = utcSundays;
exports.utcThursday = utcThursday;
exports.utcThursdays = utcThursdays;
exports.utcTuesday = utcTuesday;
exports.utcTuesdays = utcTuesdays;
exports.utcWednesday = utcWednesday;
exports.utcWednesdays = utcWednesdays;
exports.utcWeek = utcSunday;
exports.utcWeeks = utcSundays;
exports.utcYear = year;
exports.utcYears = utcYears;

Object.defineProperty(exports, '__esModule', { value: true });

}));
