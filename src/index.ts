import Holidays from "date-holidays"
import { authService } from "./auth.js"
import type { UserManagementMeResponse } from "./apiCalls.js"
import { convertDayToNumber, isWorkday } from "./helpers.js"

async function main() {
  const holidays = new Holidays("DE", "NW", {
    timezone: "Europe/Berlin",
    types: ["bank", "public"],
  })

  try {
    // 1. Perform the handshake once
    await authService.login()

    // 2. Make authenticated requests
    console.log("Fetching User Profile...")

    const response = await authService.signedFetch(
      `https://user-management.api.park-here.eu/v1/me`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error(`Request failed: ${response.status} ${response.statusText}`)
      const text = await response.text()
      console.error(text)
      return
    }

    const userData = (await response.json()) as UserManagementMeResponse

    /* Get the offset to the closest booking priority */
    const now = new Date()
    const bookingPriorities = userData.userGroup.bookingPriorities
      .map((item) => {
        const relativeWeekday = convertDayToNumber(item.day) - now.getDay()
        const relativeDay =
          relativeWeekday > 0
            ? convertDayToNumber(item.day) - 7 - now.getDay()
            : relativeWeekday

        const timestamp = new Date()
        timestamp.setDate(timestamp.getDate() + relativeDay)
        timestamp.setHours(Number(item.time.split(":")[0]))
        timestamp.setMinutes(Number(item.time.split(":")[1]))
        timestamp.setSeconds(0)
        timestamp.setMilliseconds(0)

        const isTodayBeforeAllowedBookingTime =
          timestamp.getTime() > now.getTime()
        if (isTodayBeforeAllowedBookingTime) {
          timestamp.setDate(timestamp.getDate() - 7)
        }

        const newRelativeDay = isTodayBeforeAllowedBookingTime
          ? relativeDay - 7
          : relativeDay

        return {
          ...item,
          relativeDay: newRelativeDay,
          timestamp,
          reservableDaysFromToday: item.reservableDays + newRelativeDay + 1,
        }
      })
      .sort((a, b) => a.relativeDay + b.relativeDay)

    const possibleBookingDays = Array.from(
      Array(bookingPriorities[0]?.reservableDaysFromToday).keys(),
    )
      .map((item) => {
        const timestamp = new Date()
        timestamp.setDate(timestamp.getDate() + item)
        timestamp.setUTCHours(20)
        timestamp.setMinutes(0)
        timestamp.setSeconds(0)
        timestamp.setMilliseconds(0)
        return timestamp
      })
      .filter((item) => isWorkday(item.getDay()))
      .filter((item) => !holidays.isHoliday(item))
    /* TODO: Put beginning time as timestamp */

    console.dir(possibleBookingDays, { depth: null, colors: true })
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
