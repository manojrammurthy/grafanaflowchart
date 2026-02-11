const regex = /^now$|^now\-(\d{1,10})([wdhms])$/;
const mapOptionToRelativeTimeRange = (option) => {
  return {
    from: relativeToSeconds(option.from),
    to: relativeToSeconds(option.to)
  };
};
const mapRelativeTimeRangeToOption = (range) => {
  const from = secondsToRelativeFormat(range.from);
  const to = secondsToRelativeFormat(range.to);
  return { from, to, display: `${from} to ${to}` };
};
const isRangeValid = (relative, now = Date.now()) => {
  if (!isRelativeFormat(relative)) {
    return {
      isValid: false,
      errorMessage: "Value not in relative time format."
    };
  }
  const seconds = relativeToSeconds(relative);
  if (seconds > Math.ceil(now / 1e3)) {
    return {
      isValid: false,
      errorMessage: "Can not enter value prior to January 1, 1970."
    };
  }
  return { isValid: true };
};
const isRelativeFormat = (format) => {
  return regex.test(format);
};
const relativeToSeconds = (relative) => {
  const match = regex.exec(relative);
  if (!match || match.length !== 3) {
    return 0;
  }
  const [, value, unit] = match;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed * units[unit];
};
const units = {
  w: 604800,
  d: 86400,
  h: 3600,
  m: 60,
  s: 1
};
const secondsToRelativeFormat = (seconds) => {
  if (seconds <= 0) {
    return "now";
  }
  if (seconds >= units.w && seconds % units.w === 0) {
    return `now-${seconds / units.w}w`;
  }
  if (seconds >= units.d && seconds % units.d === 0) {
    return `now-${seconds / units.d}d`;
  }
  if (seconds >= units.h && seconds % units.h === 0) {
    return `now-${seconds / units.h}h`;
  }
  if (seconds >= units.m && seconds % units.m === 0) {
    return `now-${seconds / units.m}m`;
  }
  return `now-${seconds}s`;
};

export { isRangeValid, isRelativeFormat, mapOptionToRelativeTimeRange, mapRelativeTimeRangeToOption };
//# sourceMappingURL=utils.js.map
