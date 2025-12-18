import type { Weekdays } from "./apiCalls.js"

/**
 * Converts a weekday from a string into a number
 * @param day Weekday as a string
 * @returns Weekday as a number (0 = Sunday)
 */
export const convertDayToNumber = (day: Capitalize<Weekdays>) => {
  switch (day) {
    case "Mon":
      return 1
    case "Tue":
      return 2
    case "Wed":
      return 3
    case "Thu":
      return 4
    case "Fri":
      return 5
    case "Sat":
      return 6
    case "Sun":
      return 0
  }
}

/**
 * Checks whether a given weekday is a working day, no weekend
 * @param day Weekday as a number (Sunday = 0)
 * @returns Whether the given weekday is a working day (no weekend)
 */
export const isWorkday = (day: number) => {
  if (day === 0 || day === 6) return false
  return true
}
