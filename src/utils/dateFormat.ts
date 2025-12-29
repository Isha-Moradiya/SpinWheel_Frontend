export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", options).format(
    new Date(date)
  );
};
