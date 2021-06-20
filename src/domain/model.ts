export type UserModel = {
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
}

export type AppointmentModel = {
  id: string,
  startTime: Date,
  user: UserModel,
}
