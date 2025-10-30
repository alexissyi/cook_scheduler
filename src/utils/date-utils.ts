import { assert } from "jsr:@std/assert/assert";

export const MONTHS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

export function getPeriod(dateString: string): string {
  const period = dateString.slice(0, 7);
  return period;
}

export function getMonth(dateString: string): number {
  const monthString: string = dateString.slice(5, 7);
  return Number(monthString);
}

export function getYear(dateString: string): number {
  const yearString: string = dateString.slice(0, 4);
  return Number(yearString);
}

export function getDay(dateString: string): number {
  const yearString: string = dateString.slice(-2);
  return Number(yearString);
}
