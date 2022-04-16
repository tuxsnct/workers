import { wakatimeResolvers } from './wakatime'

export const tuxsnctSchema = `
  type WakaTime {
    totalSeconds: Float
  }

  type TUXSNCT {
    wakatime: WakaTime!
  }
`

export const tuxsnctResolvers = {
  ...wakatimeResolvers
}
