import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const daysUntilExpired = (date: string) =>
  dayjs(date).diff(dayjs(), "day");
