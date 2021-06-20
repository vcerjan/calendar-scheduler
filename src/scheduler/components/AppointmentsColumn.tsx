import { getTime, isBefore, isEqual, isSameDay, set } from 'date-fns'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import React from 'react'

import { getSlotsForDay, Slot } from '../../domain/utils'
import styles from '../scheduler.module.css'

type AppointmentColumnProps = {
  onSlotClick: (slot: Slot) => void,
  day: Date,
  myAppointments: Slot[],
  reservedSlots: Slot[],
  userAppointmentsInCurrentWeek: number,
}

const userSlotsForDay = (slots: Slot[], date: Date) => {
  return slots.filter(({ time }) => isSameDay(time, date)).length
}

export const AppointmentsColumn: React.FC<AppointmentColumnProps> = ({
  day,
  onSlotClick,
  myAppointments,
  reservedSlots,
  userAppointmentsInCurrentWeek,
}) => {
  console.log('weekly max appointments state: ', userAppointmentsInCurrentWeek)

  const userAppointmensToday = userSlotsForDay(myAppointments, day)

  const isInPast = isBefore(day, set(addDays(new Date(), 1), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }))

  return (
    <div className={styles.column}>
      {
        getSlotsForDay(day).map(slot => {
          const myAppointment = myAppointments.find(({ time }) =>
            isEqual(slot.time, time))

          const otherAppointment = reservedSlots.find(({ time }) =>
            isEqual(slot.time, time))

          const appointment = myAppointment ?? otherAppointment ?? slot

          return (
            <SlotButton
              key={getTime(slot.time)}
              onClick={onSlotClick}
              slot={{ ...appointment }}
              disabled={appointment.status !== 'reservedByActiveUser'
                ? userAppointmentsInCurrentWeek > 1 || userAppointmensToday > 0 || isInPast
                : isInPast
              }
            />
          )
        }
      )}
    </div>
  )
}

const appointmentCollorSelector = (status: Slot['status']) => {
  switch (status) {
    case 'reserved':
      return styles.reserved
    case 'free':
      return styles.free
    case 'closed':
      return styles.closed
    case 'break':
      return styles.break
    case 'reservedByActiveUser':
      return styles.activeUser
  }
}

type SlotButtonProps = {
  onClick: (slot: Slot) => void,
  slot: Slot,
  disabled: boolean,
}

const SlotButton: React.FC<SlotButtonProps> = ({ onClick, slot, disabled }) => {
  const internalOnClick = React.useCallback(() => {
    onClick(slot)
  }, [onClick, slot])

  return (
    <span>
      <button
        className={appointmentCollorSelector(slot.status)}
        disabled={(slot.status !== 'free' && slot.status !== 'reservedByActiveUser') || disabled}
        onClick={internalOnClick}
      >
        {format(new Date(slot.time), 'H:mm')}
      </button>
    </span>
  )
}