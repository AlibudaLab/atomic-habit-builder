/* eslint-disable @typescript-eslint/restrict-plus-operands */

export const timeDifference = (current: number, previous: number) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
};

/**
 * Return text like 10 mins, 1 hour 23 mins
 * @param totalElapsed 
 */
export const getActivityDuration = (totalElapsed: number) => {
  const hours = Math.floor(totalElapsed / 3600);
  const minutes = Math.floor((totalElapsed % 3600) / 60);
  return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''} ${
    minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''
  }`;
}