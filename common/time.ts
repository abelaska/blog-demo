import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisYear from 'date-fns/isThisYear';

const toDate = (val: string | Date) => {
  if (typeof val === 'string') {
    return new Date(val);
  }
  return val;
};

export const fromNow = (val: string | Date) => formatDistanceToNow(toDate(val), { addSuffix: true });

export const timeOrDay = (val: string | Date) => {
  const dt = toDate(val);
  if (isToday(dt)) {
    return format(dt, 'p').replace(' ', '').toLocaleLowerCase();
  }
  if (isThisYear(dt)) {
    return format(dt, 'MMM d');
  }
  return format(dt, 'MMM d YYYY');
};
