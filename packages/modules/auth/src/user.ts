export type Credential = {
  email: string,
  password: string,
  otp: string
}

export type User = Credential & {
  name: string,
  id: string,
  secret: string,
  admin?: boolean
}

export const userHiddenKeys = ['password', 'otp', 'secret', 'admin'] as const
export type UserHiddenKeys = typeof userHiddenKeys[number]

export type UserData = Omit<User, UserHiddenKeys>

export const deleteHiddenUserProperties = (user: User): UserData => {
  // eslint-disable-next-line security/detect-object-injection
  for (const key of userHiddenKeys.values()) delete user[key]
  return user
}
