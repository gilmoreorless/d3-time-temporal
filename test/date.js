const { Temporal } = require("proposal-temporal");

// `local` kept for compatibility with existing tests.
// When using Temporal.DateTime there's no concept of "local" vs "UTC".
exports.local = exports.utc = function(year, month, day, hours, minutes, seconds, milliseconds) {
  if (year == null) year = 0;
  if (month == null) month = 1;
  if (day == null) day = 1;
  if (hours == null) hours = 0;
  if (minutes == null) minutes = 0;
  if (seconds == null) seconds = 0;
  if (milliseconds == null) milliseconds = 0;
  return new Temporal.DateTime(year, month + 1, day, hours, minutes, seconds, milliseconds);
};
