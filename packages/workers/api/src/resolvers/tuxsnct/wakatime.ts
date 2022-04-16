import { getSummaries } from '../../integration/wakatime'

export const wakatimeResolvers = {
  totalSeconds (startDate: Date, endDate: Date) {
    return getSummaries(startDate, endDate).then((summaries) => summaries.cummulative_total.seconds)
  }
}
