import { versionResolvers } from './version'

export const apiSchema = `
  type API {
    majorVersion: Int!
    minorVersion: Int!
    patchVersion: Int!
    version: String!
  }
`

export const apiResolvers = {
  ...versionResolvers
}
