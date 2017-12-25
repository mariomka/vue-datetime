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
  return new Array(Math.ceil(24 / step)).fill(null).map((item, index) => index * step)
}

export function minutes (step) {
  return new Array(Math.ceil(60 / step)).fill(null).map((item, index) => index * step)
}

export function years (current) {
  return new Array(201).fill(null).map((item, index) => current - 100 + index)
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
