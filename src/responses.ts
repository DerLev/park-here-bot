export interface UserManagementMe {
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
      name: {
        en: string
        de: string
      }
      deleted: boolean
      price: number
    }[]
    paymentOptionRequired: boolean
    bookingPriorities: {
      day: string
      reservableDays: number
      time: string
      tz: string
    }[]
    chargingBookingPriorities: {
      day: string
      reservableDays: number
      time: string
      tz: string
    }[]
    userAgreementRequired: boolean
    instantBooking: boolean
    evChargingFullDay: boolean
    numberOfUsers: number | null
    pricing: {
      reservationPricing: {
        dailyPriceFactors: {
          mon: number
          tue: number
          wed: number
          thu: number
          fri: number
          sat: number
          sun: number
        }
        violationPricing: {
          wrongParkerViolation: {
            price: number
            fixedPrice: {
              price: number
              active: boolean
            }
          }
          unusedReservationViolation: {
            price: number
            fixedPrice: {
              price: number
              active: boolean
            }
            reservationFactoredPrice: {
              price: number
              active: boolean
            }
          }
          lateDeletionViolation: {
            price: number
            fixedPrice: {
              price: number
              active: boolean
            }
            reservationFactoredPrice: {
              price: number
              active: boolean
            }
          }
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
      wrongParkerConfig: {
        sendEmail: boolean
        emailTemplate: {
          subject: string
          body: string
        }
      }
      unusedReservationConfig: {
        sendEmail: boolean
        emailTemplate: {
          subject: string
          body: string
        }
      }
      lateDeletionConfig: {
        sendEmail: boolean
        emailTemplate: {
          subject: string
          body: string
        }
        cutOffPoint: {
          day: string
          time: {
            hour: number
            minute: number
          }
        }
      }
    }
    autoBooking: {
      dailyEnabled: {
        mon: boolean
        tue: boolean
        wed: boolean
        thu: boolean
        fri: boolean
        sat: boolean
        sun: boolean
      }
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
  automatedBookingOffset: number | null,
  ssoEnabled: boolean
  managedBy: string
  userDevices: {
    id: string
    token: string
    enabled: boolean
    language: string
  }[]
}
