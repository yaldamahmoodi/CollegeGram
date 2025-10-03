export const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // اختلاف به ثانیه

  const days = Math.floor(diff / (60 * 60 * 24));
  if (days > 0) return `${days} روز پیش`;

  const hours = Math.floor(diff / (60 * 60));
  if (hours > 0) return `${hours} ساعت پیش`;

  const minutes = Math.floor(diff / 60);
  if (minutes > 0) return `${minutes} دقیقه پیش`;

  return `${diff} ثانیه پیش`;
};
