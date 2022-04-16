export type Credential = {
  email: string,
  password?: string
}

export type User = Credential & {
  admin: boolean,
  name: string,
  id: string
}
