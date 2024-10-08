import dayjs from "dayjs";

export const getWeekOfMonth = (
  date?: string | number | dayjs.Dayjs | Date | null | undefined,
) => {
  // const startOfMonth = dayjs(date).startOf('month');
  // const startOfWeek = startOfMonth.startOf('week'); // Default Sunday start of the week
  // return dayjs(date).diff(startOfWeek, 'week') + 1;
  const day = Number(dayjs(date).format("D"));

  // if the month is febuary and day is 29
  if (dayjs(date).get("month") == 1 && day === 29) {
    return Math.floor(day / 7);
  }

  return Math.ceil(day / 7);
};
