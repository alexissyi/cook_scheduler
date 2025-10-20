import { assert } from "jsr:@std/assert/assert";

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

export function equalsUser(
  user1: { kerb: string; password: string },
  user2: { kerb: string; password: string },
): boolean {
  return user1.kerb === user2.kerb && user1.password === user2.password;
}
