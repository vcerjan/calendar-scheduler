import { addMinutes, getDate, getDay, set } from "date-fns"
import { AppointmentModel } from "./model"

export type SlotStatus = 'free' | 'closed' | 'break' | 'reserved' | 'reservedByActiveUser'

export type Slot = {
  time: Date,
  status: SlotStatus,
  appointmentData?: AppointmentModel,
}

export const getSlotsForDay = (date: Date): Slot[] => {
  const day = getDate(date)
  const firstSlot = set(date, { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })
  if (getDay(date) === 0) {
    return Array(22).fill(0).map((_, i): Slot => {
      return {
        status: 'closed',
        time: addMinutes(firstSlot, 30 * i),
      }
    })
  }
  if (getDay(date) === 6) {
    if (day % 2 === 0) {
      return Array(22).fill(0).map((_, i): Slot => {
        if (i < 12) {
          if (i === 6) {
            return {
              status: 'break',
              time: addMinutes(firstSlot, 30 * i),
            }
          }
          return {
            status: 'free',
            time: addMinutes(firstSlot, 30 * i),
          }
        } else {
          return {
            status: 'closed',
            time: addMinutes(firstSlot, 30 * i),
          }
        }
      }) 
    } else {
      return Array(22).fill(0).map((_, i): Slot => {
        return {
          status: 'closed',
          time: addMinutes(firstSlot, 30 * i),
        }
      })
    }
  }
  if (day % 2 === 0) {
    return Array(22).fill(0).map((_, i): Slot => {
      if (i < 12) {
        if (i === 6) {
          return {
            status: 'break',
            time: addMinutes(firstSlot, 30 * i),
          }
        }
        return {
          status: 'free',
          time: addMinutes(firstSlot, 30 * i),
        }
      } else {
        return {
          status: 'closed',
          time: addMinutes(firstSlot, 30 * i),
        }
      }
    })
  } else {
    return Array(22).fill(0).map((_, i): Slot => {
      if (i > 11) {
        if (i === 16) {
          return {
            status: 'break',
            time: addMinutes(firstSlot, 30 * i),
          }
        }
        return {
          status: 'free',
          time: addMinutes(firstSlot, 30 * i),
        }
      } else {
        return {
          status: 'closed',
          time: addMinutes(firstSlot, 30 * i),
        }
      }
    })
  }
}

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#jsf--smallprng

export const jsf32 = (a: number, b: number, c: number, d: number) => () => {
  a |= 0; b |= 0; c |= 0; d |= 0;
  // eslint-disable-next-line no-mixed-operators
  var t = a - (b << 27 | b >>> 5) | 0;
  // eslint-disable-next-line no-mixed-operators
  a = b ^ (c << 17 | c >>> 15);
  b = c + d | 0;
  c = d + t | 0;
  d = a + t | 0;
  return (d >>> 0) / 4294967296;
}
