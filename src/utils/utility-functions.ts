export function getMonth(dateString: string): number {
  const monthString: string = dateString.slice(5, 7);
  return Number(monthString);
}

export function getYear(dateString: string): number {
  const yearString: string = dateString.slice(0, 4);
  return Number(yearString);
}
