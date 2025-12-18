/* eslint-disable @typescript-eslint/no-explicit-any */
export type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

export type Languages = "de" | "en"

interface Violation {
  price: number
  fixedPrice: {
    price: number
    active: boolean
  }
}

interface ViolationWithFactoredPrice extends Violation {
  reservationFactoredPrice: {
    price: number
    active: boolean
  }
}

interface ViolationConfig {
  sendEmail: boolean
  emailTemplate: {
    subject: string
    body: string
  }
}

interface BookingPriority {
  day: Capitalize<Weekdays>
  reservableDays: number
  time: string
  tz: string
}

export interface UserManagementMeResponse {
  id: string
  customId: string
  email: string
  name: string
  enabled: boolean
  licensePlate: string
  cars: {
    carName: string | null
    licensePlate: string
    active: true
  }[]
  locationId: number
  roles: {
    id: number
    name: string
  }[]
  userGroup: {
    uuid: string
    id: number
    id2: string
    locationId: string
    name: string
    parkingSpotMandatory: boolean
    reservationMandatory: boolean
    bookableAtWeekend: boolean
    assignedParkingSpotTypes: number[]
    assignedPriorityParkingSpotTypes: {
      priorityLevel: number
      parkingSpotTypeId: number
      parkingSpotProtection: boolean
    }[]
    bookingTimeslots: {
      id: string
      locationId: number
      startTime: string
      endTime: string
      name: Record<Languages, string>
      deleted: boolean
      price: number
    }[]
    paymentOptionRequired: boolean
    bookingPriorities: BookingPriority[]
    chargingBookingPriorities: BookingPriority[]
    userAgreementRequired: boolean
    instantBooking: boolean
    evChargingFullDay: boolean
    numberOfUsers: number | null
    pricing: {
      reservationPricing: {
        dailyPriceFactors: Record<Weekdays, number>
        violationPricing: {
          wrongParkerViolation: Violation
          unusedReservationViolation: ViolationWithFactoredPrice
          lateDeletionViolation: ViolationWithFactoredPrice
        }
      }
    }
    chargingUnitPrice: number
    licenseFee: number | null
    costCap: number | null
    deleted: boolean
    createdOn: number
    deletedOn: number | null
    violationEmails: {
      sendEmailForWrongParker: boolean
      sendEmailForUnusedReservation: boolean
    }
    violationConfig: {
      wrongParkerConfig: ViolationConfig
      unusedReservationConfig: ViolationConfig
      lateDeletionConfig: {
        cutOffPoint: {
          day: string
          time: {
            hour: number
            minute: number
          }
        }
      } & ViolationConfig
    }
    autoBooking: {
      dailyEnabled: Record<Weekdays, boolean>
      managedBy: string
    }
  }
  preferredParkingSpotId: number | null
  bookableAreas: {
    id: number
    name: string
    bookableSectors: {
      id: number
      name: string
    }[]
    latitude: number
    longitude: number
  }[]
  paymentOptions: any[]
  subsidiaryId: number | null
  charging: boolean
  userAgreements: any[]
  automatedBookingOffset: number | null
  ssoEnabled: boolean
  managedBy: string
  userDevices: {
    id: string
    token: string
    enabled: boolean
    language: string
  }[]
}
