export const convertSecondsToDays = (endAt: number) => {
  const dayInMs = 86400000;
  const currentTime = new Date().getTime();

  const resultMs = (endAt * 1000) - currentTime;

  const days = resultMs / dayInMs;

  return days.toFixed(1);
};
