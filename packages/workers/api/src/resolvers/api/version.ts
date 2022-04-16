import { API_VERSION, API_VERSION_STRING } from '../../version'

export const versionResolvers = {
  majorVersion () {
    return API_VERSION[0]
  },
  minorVersion () {
    return API_VERSION[1]
  },
  patchVersion () {
    return API_VERSION[2]
  },
  version () {
    return API_VERSION_STRING
  }
}
