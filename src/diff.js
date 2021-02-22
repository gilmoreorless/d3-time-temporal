export default function diff(start, end, field, largestUnit = 'days') {
  var diff = end.since(start, { largestUnit });
  return diff[field];
}
