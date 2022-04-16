type SummaryData = {
  decimal: string,
  digital: string,
  hours: number,
  minutes: number,
  name: string,
  percent: number,
  seconds: number,
  text: string,
  total_seconds: number
}

type SummariesResponse = {
  branch: SummaryData[],
  cummulative_total: Exclude<SummaryData, 'decimal' | 'digital' | 'seconds' | 'text'>,
  data: SummaryData[],
  dependencies: SummaryData[],
  editors: SummaryData[],
  grand_total: Omit<SummaryData, 'name' | 'percent' | 'seconds'>,
  languages: SummaryData[],
  machines: SummaryData[],
  operating_systems: SummaryData[],
  projects: SummaryData[],
  range: {
    date: string,
    end: string,
    start: string,
    text: string,
    timezone: string
  },
  end: string,
  start: string
}

export const getSummaries = (startDate: Date, endDate: Date) => fetch(`
  https://wakatime.com/api/v1/users/current/summaries
    ?start=${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDay()}
    &end=${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDay()}
`)
  .then((response) => {
    if (response.status === 200) {
      return response.json<SummariesResponse>()
    }
    throw new Error('bad response')
  })
