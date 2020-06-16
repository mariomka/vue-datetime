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

  return Array.apply(null, Array(monthDate.daysInMonth + firstDay + lastDay))
    .map((value, index) =>
      (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay)
    )
}

function getDateFromDateTime (dateTime) {
  return DateTime.fromObject({ year: dateTime.c.year, month: dateTime.c.month, day: dateTime.c.day, zone: 'UTC' })
}

function checkAllowedDateTimeRanges (allowedDateTimeRanges, start, end = null) {
  end = end || start
  return allowedDateTimeRanges && !allowedDateTimeRanges.find(function (dates) {
    const startDayDate = dates[0] ? getDateFromDateTime(dates[0]) : null
    const endDayDate = dates[1] ? getDateFromDateTime(dates[1]) : null
    return (startDayDate && start >= startDayDate) && (endDayDate && end <= endDayDate)
  })
}

export function monthDayIsDisabled (allowedDateTimeRanges, year, month, day) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.fromObject({ year, month, day, zone: 'UTC' }))
}

export function monthIsDisabled (allowedDateTimeRanges, year, month) {
  return checkAllowedDateTimeRanges(
    allowedDateTimeRanges,
    DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth),
    DateTime.utc(year, month, 1)
  )
}

export function yearIsDisabled (allowedDateTimeRanges, year) {
  return checkAllowedDateTimeRanges(allowedDateTimeRanges, DateTime.utc(year))
}

export function timeComponentIsDisabled (min, max, component) {
  return (min !== null && component < min) ||
         (max !== null && component > max)
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
  return Array.apply(null, Array(Math.ceil(24 / step))).map((item, index) => index * step)
}

export function minutes (step) {
  return Array.apply(null, Array(Math.ceil(60 / step))).map((item, index) => index * step)
}

export function years (current) {
  return Array.apply(null, Array(201)).map((item, index) => current - 100 + index)
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
    weekstart = require('weekstart/package.json').version ? require('weekstart') : null
  } catch (e) {
    weekstart = window.weekstart
  }

  const firstDay = weekstart ? weekstart.getWeekStartByLocale(Settings.defaultLocale) : 1

  return firstDay === 0 ? 7 : firstDay
}
