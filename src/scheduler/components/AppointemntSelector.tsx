import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { addDays, format, getDate, getDay, startOfWeek, subDays, getTime, getYear, getWeek, Interval, isWithinInterval } from 'date-fns'

import { AppointmentReservationModal } from '../../common/components/AppointmentReservationModal'
import { AppointmentsColumn } from './AppointmentsColumn'
import { getSlotsForDay, jsf32, Slot } from '../../domain/utils'
import { AppointmentModel } from '../../domain/model'
import styles from '../scheduler.module.css'

type DayDescriptor = {
  label: string,
  index: Day,
  date: Date,
  timestamp: number,
}

type AppointmentSelectorProps = {
  myAppointments: Slot[]
  updateMyAppointments: (slot: Slot) => void,
  removeAppointment: (slot: Slot) => void,
}

const userSlotsForWeek = (slots: Slot[], firstDayInWeek: Date) => {
  const interval: Interval = {
    start: firstDayInWeek,
    end: addDays(firstDayInWeek, 7)
  }
  return slots.filter(({ time }) => isWithinInterval(time, interval)).length
}

export const AppointmentSelector: React.FC<AppointmentSelectorProps> = ({ myAppointments, updateMyAppointments, removeAppointment }) => {
  const [week, setWeek] = useState<DayDescriptor[]>([])
  const [modalData, setModalData] = useState<Slot | null>(null)
  const [weekIndex, setWeekIndex] = React.useState<number>()
  const [year, setYear] = React.useState<number>()

  const getNewWeek = React.useCallback((date: Date) => {
    const start: Date = startOfWeek(date, { weekStartsOn: 1 })
    const newWeek: DayDescriptor[] = []

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i)
      newWeek.push({
        label: format(day, 'E').toString(),
        index: getDay(day),
        date: day,
        timestamp: getDate(day),
      })
    }
    setWeek(newWeek)
    setWeekIndex(getWeek(newWeek[0].date))
    setYear(getYear(newWeek[0].date))
  }, [])

  useEffect(() => {
    getNewWeek(new Date())
  }, [getNewWeek])

  const nextWeek = React.useCallback(() => {
    getNewWeek(addDays(week[0].date, 7))
  }, [week, getNewWeek])

  const prevWeek = React.useCallback(() => {
    getNewWeek(subDays(week[0].date, 7))
  }, [week, getNewWeek])

  const onSlotClick = React.useCallback((slot: Slot) => {
    console.log('slot data: ', slot, modalData)
    if (slot.status === 'reservedByActiveUser') {
      removeAppointment(slot)
    } else {
      setModalData(slot)
      console.log(modalData)
    }
  }, [modalData, removeAppointment])

  const onDismiss = React.useCallback(() => {
    setModalData(null)
  }, [])

  const onConfirm = React.useCallback((appointmentData: AppointmentModel) => {
    const newSlot: Slot = {
      time: modalData!.time,
      status: 'reservedByActiveUser',
      appointmentData,
    }
    setModalData(null)
    updateMyAppointments(newSlot)
  }, [modalData, updateMyAppointments])

  const reservedSlots = React.useMemo(() => {
    const jsf = jsf32(year ?? 0, weekIndex ?? 0, 0, 0)

    const slots = week.reduce((acc, weekDay) => {
      return acc.concat(getSlotsForDay(weekDay.date).filter(({ status }) => status === 'free'))
    }, [] as Slot[])

    const takenSlots: Slot[] = []

    for (let i = 0; i < 15; i++) {
      const index = Math.floor(jsf() * 1000) % slots.length
      takenSlots.push({ ...slots[index], status: 'reserved' })
      slots.splice(index, 1)
    }
    return takenSlots
  }, [year, weekIndex, week])

  const userAppointmentsInWeek = userSlotsForWeek(myAppointments, week[0]?.date ?? new Date())

  return (
    <div className={classNames(styles.row, styles.wrapper)}>
      {modalData != null &&
        <AppointmentReservationModal
          title="Appointment Form"
          startTime={modalData.time}
          date={getTime(new Date()).toString()}
          onConfirm={onConfirm}
          onDismiss={onDismiss}
        />
      }
      {week.map(weekDay => {
        return (
          <div key={`${weekDay.date}`} className={styles.column}>
            <p>
              {weekDay.label}
            </p>
            <p>
              {weekDay.timestamp}
            </p>
            <AppointmentsColumn
              onSlotClick={onSlotClick}
              day={weekDay.date}
              
              reservedSlots={reservedSlots}
              myAppointments={myAppointments}
              userAppointmentsInCurrentWeek={userAppointmentsInWeek}
            />
          </div>
        )
      })}
      <div>
        <button onClick={prevWeek}>Prev</button>
        <button onClick={nextWeek}>Next</button>
      </div>
    </div>
  )
}