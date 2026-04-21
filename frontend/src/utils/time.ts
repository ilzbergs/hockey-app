export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type CountdownResult = {
  done: boolean
  parts: CountdownParts | null
}

/**
 * Normalizē datumu uz safe Date objektu
 */
function parseDate(date: Date | string): Date {
  const d = new Date(date)
  if (isNaN(d.getTime())) throw new Error('Invalid date provided to countdown')
  return d
}

export function getTimeLeft(startDate: Date | string): CountdownResult {
  const start = parseDate(startDate)

  const diff = start.getTime() - Date.now()

  if (diff <= 0) {
    return { done: true, parts: null }
  }

  const msInSecond = 1000
  const msInMinute = 60 * msInSecond
  const msInHour = 60 * msInMinute
  const msInDay = 24 * msInHour

  const days = Math.floor(diff / msInDay)
  const hours = Math.floor((diff % msInDay) / msInHour)
  const minutes = Math.floor((diff % msInHour) / msInMinute)
  const seconds = Math.floor((diff % msInMinute) / msInSecond)

  return {
    done: false,
    parts: { days, hours, minutes, seconds },
  }
}
