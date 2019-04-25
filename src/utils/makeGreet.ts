import dayjs from "dayjs";

export const makeGreet = (): string => {
  const hour = dayjs().hour();
  switch (Math.trunc(hour / 6)) {
    case 1:
      return "🎉 Good morning";
    case 2:
      return "🌞 Good afternoon";
    case 3:
      return "🌙 Good evening";
    default:
      return "✌ Greetings";
  }
};
