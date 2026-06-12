export const formatDate = (dateString: string | Date, formatStr: string = 'id-ID'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(formatStr, { day: 'numeric', month: 'short', year: 'numeric' });
};