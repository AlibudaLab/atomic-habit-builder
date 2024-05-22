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
  return moment.unix(Number(timestamp.toString())).format('MMMM DD');
}

export function formatDuration(start: number, end: number): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}
