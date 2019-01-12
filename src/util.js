import { DateTime, Info, Settings } from 'luxon'
import FlowManager from './FlowManager'

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function datetimeFromISO (string) {
  const datetime = DateTime.fromISO(string).toUTC()

  return datetime.isValid ? datetime : null
}

export function monthDays (year, month, weekStart) {
  const monthDate = DateTime.local(year, month, 1)
  let firstDay = monthDate.weekday - weekStart

  if (firstDay < 0) {
    firstDay += 7
  }
  let lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7
  if (lastDay < 0) {
    lastDay += 7
  }

  return new Array(monthDate.daysInMonth + firstDay + lastDay)
    .fill(null)
    .map((value, index) =>
      (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay)
    )
}

export function monthDayIsDisabled (minDate, maxDate, year, month, day) {
  const date = DateTime.fromObject({ year, month, day, zone: 'UTC' })

  minDate = minDate ? startOfDay(minDate) : null
  maxDate = maxDate ? startOfDay(maxDate) : null

  return (minDate && date < minDate) ||
         (maxDate && date > maxDate)
}

export function monthIsDisabled (minDate, maxDate, year, month) {
  return (minDate && minDate > DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth)) ||
         (maxDate && maxDate < DateTime.utc(year, month, 1))
}

export function yearIsDisabled (minDate, maxDate, year) {
  const minYear = minDate ? minDate.year : null
  const maxYear = maxDate ? maxDate.year : null

  return (minYear && year < minYear) ||
         (maxYear && year > maxYear)
}

export function timeComponentIsDisabled (min, max, component) {
  return (min && component < min) ||
         (max && component > max)
}

export function weekdays (weekStart) {
  if (--weekStart < 0) {
    weekStart = 6
  }

  let weekDays = Info.weekdays('short').map(weekday => capitalize(weekday))

  weekDays = weekDays.concat(weekDays.splice(0, weekStart))

  return weekDays
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

export function startOfDay (datetime) {
  return datetime.startOf('day')
}

export function createFlowManager (flow) {
  return new FlowManager(flow, 'end')
}

export function createFlowManagerFromType (type) {
  let flow = []

  switch (type) {
    case 'datetime':
      flow = ['date', 'time']
      break
    case 'time':
      flow = ['time']
      break
    default:
      flow = ['date']
  }

  return new FlowManager(flow, 'end')
}

export function weekStart () {
  let weekstart

  try {
    weekstart = require('weekstart')
  } catch (e) {
    weekstart = window.weekstart
  }

  const firstDay = weekstart ? weekstart.getWeekStartByLocale(Settings.defaultLocale) : 1

  return firstDay === 0 ? 7 : firstDay
}
