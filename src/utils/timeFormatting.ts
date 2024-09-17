const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeStyle: 'medium'
});

export const dateToLongString = (date: Date) => longDateFormatter.format(date);

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short'
});

export const dateToShortString = (date: Date) =>
  shortDateFormatter.format(date);
