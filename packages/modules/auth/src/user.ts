export type Credential = {
  email: string,
  password: string,
  otp: string
}

export type User = Credential & {
  name: string,
  id: string,
  secret: string
}

export const credentialHiddenKeys = ['password', 'otp'] as const
export type CredentialHiddenKeys = typeof credentialHiddenKeys[number]

export const userHiddenKeys = [...credentialHiddenKeys, 'secret'] as const
export type UserHiddenKeys = typeof userHiddenKeys[number]

export type UserData = PartiallyPartial<User, UserHiddenKeys>
