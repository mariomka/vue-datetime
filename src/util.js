import { DateTime, Info } from 'luxon'
import FlowManager from './FlowManager'

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function monthDays (year, month) {
  const monthDate = DateTime.local(year, month, 1)
  const firstDay = monthDate.weekday - 1

  return new Array(monthDate.daysInMonth + firstDay)
    .fill(null)
    .map((value, index) => {
      return index + 1 <= firstDay ? null : index + 1 - firstDay
    })
}

export function weekdays () {
  return Info.weekdays('short').map(weekday => capitalize(weekday))
}

export function months () {
  return Info.months().map(month => capitalize(month))
}

export function hours (step) {
  const hours = []

  for (let i = 0; i < 24; i += step) {
    hours.push(i)
  }

  return hours
}

export function minutes (step) {
  const minutes = []

  for (let i = 0; i < 60; i += step) {
    minutes.push(i)
  }

  return minutes
}

export function years (current) {
  const years = []

  for (let i = current - 100; i <= current + 100; i++) {
    years.push(i)
  }

  return years
}

export function pad (number) {
  return number < 10 ? '0' + number : number
}

export function createFlowManagerFromType (type) {
  let flow = []

  switch (type) {
    case 'datetime':
      flow = ['date', 'time']
      break
    default:
      flow = ['date']
  }

  return new FlowManager(flow, 'end')
}
