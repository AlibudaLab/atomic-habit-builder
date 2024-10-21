import moment from 'moment';

/**
 * This function converts a timestamp in bigint to a Date object.
 * @param timestamp The timestamp to convert to a Date object.
 * @returns The Date object.
 */
export function convertBigIntTimestampToDate(timestamp: bigint): Date {
  return new Date(Number(timestamp) * 1000);
}

export function formatTime(timestamp: number): string {
  return moment.unix(Number(timestamp.toString())).format('MMM DD');
}

export function formatDuration(start: number, end: number): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function getCountdownString(ending: number, shorten = false) {
  var now = moment();
  var end = moment.unix(ending); // another date
  var duration = moment.duration(end.diff(now));

  //Get Days and subtract from duration
  var days = duration.days();
  duration.subtract(days, 'days');

  //Get hours and subtract from duration
  var hours = duration.hours();
  duration.subtract(hours, 'hours');

  //Get Minutes and subtract from duration
  var minutes = duration.minutes();
  duration.subtract(minutes, 'minutes');

  //Get seconds
  var seconds = duration.seconds();

  // If > 14 days, only show days
  if (days > 14) {
    return `${days}${shorten ? 'd' : ' days'}`;
  }
  // If > 0 days, show days and hours
  else if (days > 0) {
    return `${days}${shorten ? 'd' : ' days'}, ${hours}${shorten ? 'h' : ' hours'}`;
  }

  // If > 0 hours, show hours and minutes
  else if (hours > 0) {
    return `${hours}${shorten ? 'h' : ' hours'}, ${minutes}${shorten ? 'm' : ' minutes'}`;
  }

  return `${minutes}${shorten ? 'm' : ' minutes'}`;
}

export function getDurationString(start: number, end: number): string {
  const duration = moment.duration(end - start, 'second');
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  return `${days} days, ${hours} hours`;
}

export function formatActivityTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function getChallengePeriodHint(start: number, end: number): string {
  // If it's not started yet, show "starts in "
  if (start > moment().unix()) {
    return `Starts in ${getCountdownString(start, true)}`;
  }
  // If it's already ended, show "nothing"
  else if (end < moment().unix()) {
    return '';
  }
  // If it's ongoing, show "ends in "
  else {
    return `${getCountdownString(end, true)} left`;
  }
}
