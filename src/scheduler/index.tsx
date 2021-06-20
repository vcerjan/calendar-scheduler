import isEqual from 'date-fns/isEqual'
import React from 'react'

import { Slot } from '../domain/utils'
import { AppointmentSelector } from './components/AppointemntSelector'

type SchedulerProps = {
  title?: string,
}

export const Scheduler: React.FC<SchedulerProps> = ({ title = 'Scheduler component' }) => {
  const [myAppointments, setMyAppointments] = React.useState<Slot[]>([])

  React.useEffect(() => {
    const rawData = window.localStorage.getItem('myAppointments')
    if (rawData == null) {
      return
    }
    const appointments = JSON.parse(rawData)
      .map((slot: Slot) =>
        ({ ...slot, time: new Date(slot.time) }))
    setMyAppointments(appointments)
  }, [])

  const updateMyAppointments = React.useCallback((slot: Slot) => {
    const newAppointments = [ ...myAppointments, slot ]
    try {
      window.localStorage.setItem('myAppointments', JSON.stringify(newAppointments))
    } catch (error) {
      console.error(error) 
    } finally {
      setMyAppointments(newAppointments)
    }
  }, [myAppointments])

  const removeAppointment = React.useCallback((slot: Slot) => {
    const newAppointments = myAppointments.filter(({ time }) => !isEqual(time, slot.time))
    try {
      window.localStorage.setItem('myAppointments', JSON.stringify(newAppointments))
    } catch (error) {
      console.error(error) 
    } finally {
      setMyAppointments(newAppointments)
    }
  }, [myAppointments])

  return (
    <div>
      <h1>{title}</h1>
      <AppointmentSelector
        myAppointments={myAppointments}
        updateMyAppointments={updateMyAppointments}
        removeAppointment={removeAppointment}
      />
    </div>
  )
}
