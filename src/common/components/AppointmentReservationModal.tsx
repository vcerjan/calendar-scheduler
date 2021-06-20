import { formatISO } from 'date-fns'
import format from 'date-fns/format'
import React from 'react'

import { AppointmentModel } from '../../domain/model'
import { User } from '../constants/mockdata'
import styles from '../styles/modal.module.css'

type ModalProps = {
  title: string,
  startTime: Date,
  date: string,
  onConfirm: (appointment: AppointmentModel) => void,
  onDismiss: () => void,
}

export const AppointmentReservationModal: React.FC<ModalProps> = ({
  startTime,
  onConfirm,
  onDismiss,
}) => {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')

  const onFirstNameChange = React.useCallback((e: React.SyntheticEvent<HTMLInputElement>) =>
    setFirstName(e.currentTarget.value), [])
  
  const onLastNameChange = React.useCallback((e: React.SyntheticEvent<HTMLInputElement>) =>
    setLastName(e.currentTarget.value), [])
  
  const onEmailChange = React.useCallback((e: React.SyntheticEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value), [])

  const internalOnConfirm = React.useCallback(() => {
    onConfirm({
      id: formatISO(startTime),
      startTime,
      user: User,
      // firstName,
      // lastName,
      // email,
    })
  }, [onConfirm, startTime])

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <div className={styles.header}>
          <p>{format(startTime, "yyyy-MM-dd HH:mm")}</p>
        </div>
        <div className={styles.body}>
          {/* <span className={styles.inputWrapper}>
            <label className={styles.inputLabel}>First Name</label>
            <input type="text" disabled value={User.firstName} onChange={onFirstNameChange} />
          </span>
          <span className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Last Name</label>
            <input type="text" disabled value={User.lastName} onChange={onLastNameChange} />
          </span>
          <span className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Email Address</label>
            <input type="text" disabled value={User.email} onChange={onEmailChange} />
          </span> */}
          <span>
            <p className={styles.text}>Are you sure you want to reserve this appointment?</p>
          </span>
        </div>
        <div className={styles.buttonsWrapper}>
          <button onClick={onDismiss}>Close</button>
          <button onClick={internalOnConfirm}>Confirm</button>
        </div>
      </div>
    </>
  )
}